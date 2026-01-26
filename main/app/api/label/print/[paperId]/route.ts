import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { paperId: string } }) {
  const { paperId } = params;

  try {
    // Fetch paper label
    const label = await prisma.paperLabel.findUnique({
      where: { paperId },
      include: { book: true },
    });
    if (!label) return NextResponse.json({ error: 'Label not found' }, { status: 404 });

    if (label.status === 'printed') {
      return NextResponse.json({ error: 'Label already printed' }, { status: 400 });
    }

    // Generate QR code
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/label/verify/${paperId}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl);

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText('The Veridion Book Hunt', { x: 50, y: height - 50, size: 18, font, color: rgb(0,0.4,0.8) });
    page.drawText(`Title: ${label.book.title}`, { x: 50, y: height - 90, size: 14 });
    page.drawText(`Author: ${label.book.author}`, { x: 50, y: height - 120, size: 12 });
    page.drawText(`ISBN: ${label.book.isbn ?? 'N/A'}`, { x: 50, y: height - 150, size: 12 });
    page.drawText(`Paper ID: ${paperId}`, { x: 50, y: height - 180, size: 12 });

    const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    page.drawImage(qrImage, { x: 50, y: height - 400, width: 200, height: 200 });

    const pdfBytes = await pdfDoc.save();

    // Mark as printed
    await prisma.paperLabel.update({
      where: { paperId },
      data: { status: 'printed', printedAt: new Date() },
    });

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=TVBH_${paperId}.pdf`,
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}