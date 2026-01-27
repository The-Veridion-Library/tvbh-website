import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

export interface LabelPdfData {
  labelId: string;
  bookId: string;
  title: string;
  author: string;
  printedAt: Date;
  appUrl: string; // for QR code
}

/**
 * Generates a professional landscape, foldable, black-and-white PDF for a book label
 */
export async function generateLabelPdf(data: LabelPdfData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Landscape: 600x400 px
  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // --- Background ---
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  // --- Header Bar ---
  page.drawRectangle({ x: 0, y: height - 60, width, height: 60, color: rgb(0, 0, 0) });
  page.drawText('📚 Book Label', {
    x: 30,
    y: height - 45,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // --- Fold line (dashed) ---
  const foldX = width / 2;
  const dashLength = 5;
  for (let y = 30; y < height - 30; y += dashLength * 2) {
    page.drawLine({
      start: { x: foldX, y },
      end: { x: foldX, y: y + dashLength },
      thickness: 0.5,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // --- Left column box ---
  const leftBoxX = 30;
  const leftBoxY = 30;
  const leftBoxWidth = foldX - leftBoxX - 20;
  const leftBoxHeight = height - 90;

  // Box border
  page.drawRectangle({
    x: leftBoxX,
    y: leftBoxY,
    width: leftBoxWidth,
    height: leftBoxHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  // Info inside box
  const infoStartY = height - 90;
  let currentY = infoStartY;
  const lineHeight = 28;
  page.drawText(`Label ID: ${data.labelId}`, { x: leftBoxX + 10, y: currentY, size: 16, font: boldFont });
  currentY -= lineHeight;
  page.drawText(`Book ID: ${data.bookId}`, { x: leftBoxX + 10, y: currentY, size: 16, font: regularFont });
  currentY -= lineHeight;
  page.drawText(`Title: ${data.title}`, { x: leftBoxX + 10, y: currentY, size: 16, font: regularFont });
  currentY -= lineHeight;
  page.drawText(`Author: ${data.author}`, { x: leftBoxX + 10, y: currentY, size: 16, font: regularFont });
  currentY -= lineHeight;
  page.drawText(`Printed At: ${data.printedAt.toLocaleString()}`, { x: leftBoxX + 10, y: currentY, size: 14, font: regularFont, color: rgb(0.2, 0.2, 0.2) });

  // --- Right column box (QR) ---
  const rightBoxX = foldX + 20;
  const rightBoxY = 30;
  const rightBoxWidth = width - rightBoxX - 30;
  const rightBoxHeight = height - 60;

  // Box border
  page.drawRectangle({
    x: rightBoxX,
    y: rightBoxY,
    width: rightBoxWidth,
    height: rightBoxHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  // QR Code
  const qrDataUrl = await QRCode.toDataURL(`${data.appUrl}/labels/${data.labelId}`);
  const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  const qrSize = Math.min(rightBoxWidth - 40, rightBoxHeight - 60);
  page.drawImage(qrImage, {
    x: rightBoxX + (rightBoxWidth - qrSize) / 2,
    y: rightBoxY + (rightBoxHeight - qrSize) / 2 + 20,
    width: qrSize,
    height: qrSize,
  });

  // QR instructions
  page.drawText('Scan QR to verify', {
    x: rightBoxX + 20,
    y: rightBoxY + 20,
    size: 12,
    font: regularFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  return pdfDoc.save();
}