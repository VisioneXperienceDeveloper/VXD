import { NextRequest, NextResponse } from 'next/server';

import { createComment } from '@/lib/services';

// Simple in-memory rate limiting (for development)
// In production, use Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(ip, { count: 1, resetTime: now + 10 * 60 * 1000 }); // 10 minutes
    return true;
  }
  
  if (limit.count >= 3) {
    return false; // Rate limit exceeded
  }
  
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many comments. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { postId, comment } = body;
    
    if (!postId || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const result = await createComment(postId, comment);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Comment submitted successfully. It will appear after approval.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    );
  }
}
