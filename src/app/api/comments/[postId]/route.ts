import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByPostId } from '@/lib/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const comments = await getCommentsByPostId(postId);
    
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
