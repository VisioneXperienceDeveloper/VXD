import { incrementViewCount } from '@/lib/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing page ID' }, { status: 400 });
    }

    const newCount = await incrementViewCount(id);
    
    return NextResponse.json({ viewCount: newCount });
  } catch (error) {
    console.error('Failed to increment view count:', error);
    return NextResponse.json({ error: 'Failed to update view count' }, { status: 500 });
  }
}
