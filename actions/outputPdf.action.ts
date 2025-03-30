import { NextResponse } from 'next/server';
import { createOutputPdf } from '@/lib/createpdffromJSON';
import fs from 'fs';

const handler = async (req: Request) => {
  try {
    const { json } = await req.json();

    // Generate and save the PDF locally    
    const pdfPath = await createOutputPdf(json);

    // Serve the saved PDF file
    const pdfBytes = fs.readFileSync(pdfPath);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=${pdfPath.split('/').pop()}`,
      },
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
};

export default handler;
