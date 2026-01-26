import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { paperId: string } }) {
  const { paperId } = params;

  try {
    const label = await prisma.paperLabel.findUnique({
      where: { paperId },
      include: { book: true },
    });
    if (!label) return NextResponse.json({ valid: false, error: 'Label not found' });

    return NextResponse.json({
      valid: true,
      paperId: label.paperId,
      status: label.status,
      book: {
        title: label.book.title,
        author: label.book.author,
        isbn: label.book.isbn,
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ valid: false, error: 'Server error' });
  }
}
