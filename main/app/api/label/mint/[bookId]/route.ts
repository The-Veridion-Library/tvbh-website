import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { bookId: string } }) {
  const { bookId } = params;

  try {
    // Check if book exists
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });

    // Generate random paperId
    const paperId = crypto.randomBytes(8).toString('hex');

    const label = await prisma.paperLabel.create({
      data: {
        paperId,
        bookId,
      },
    });

    return NextResponse.json({ success: true, label });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}