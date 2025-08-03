// app/api/latex-to-pdf/route.js  <-- IMPORTANT: New file path
import CloudConvert from 'cloudconvert'; // This is the corrected line
import { NextResponse } from 'next/server'; // Import NextResponse for App Router responses

export async function POST(request) { // Use 'request' parameter (lowercase 'r')
  // No need for 'if (request.method !== "POST")' check here,
  // as the function name 'POST' already indicates the method.

  const body = await request.json(); // Read the request body for App Router
  const latexCode = body.latex;

  if (!latexCode) {
    return NextResponse.json({ message: 'LaTeX code is required.' }, { status: 400 });
  }

  const API_KEY = process.env.CLOUDCONVERT_API_KEY;

  if (!API_KEY) {
    console.error('CLOUDCONVERT_API_KEY is not set in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: CloudConvert API Key missing.' }, { status: 500 });
  }

  // --- ADD THIS LINE FOR DEBUGGING ---
  console.log('CloudConvert API Key loaded:', API_KEY ? 'Yes (length: ' + API_KEY.length + ')' : 'No');
  // --- END ADDITION ---

  try {
    const cloudConvert = new CloudConvert({
      apiKey: API_KEY,
      sandbox: false,
    });

    const job = await cloudConvert.jobs.create({
      tasks: {
        'upload-latex': {
          operation: 'import/raw',
          file: Buffer.from(latexCode).toString('base64'),
          filename: 'resume.tex',
          mimetype: 'application/x-latex',
        },
        'convert-to-pdf': {
          operation: 'convert',
          input: 'upload-latex',
          output_format: 'pdf',
        },
        'export-pdf': {
          operation: 'export/url',
          input: 'convert-to-pdf',
          inline: false,
        },
      },
    });

    const completedJob = await cloudConvert.jobs.wait(job.id);

    const file = cloudConvert.jobs.getExportUrls(completedJob).find(f => f.filename.endsWith('.pdf'));

    if (!file) {
      throw new Error('PDF file not found in CloudConvert job output. Check CloudConvert dashboard for job status or if compilation failed.');
    }

    const pdfDownloadUrl = file.url;

    const pdfResponse = await fetch(pdfDownloadUrl);

    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF from CloudConvert URL: ${pdfResponse.statusText}`);
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    // Return a new Response object with the PDF buffer and appropriate headers
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
      status: 200,
    });

  } catch (error) {
    console.error('API Error:', error);
    // Return NextResponse.json for error responses in App Router
    let errorMessage = 'An unexpected server error occurred during PDF generation.';
    let errorDetails = error.message;

    if (error.message.includes('PDF file not found') || error.message.includes('Failed to download PDF')) {
        errorMessage = error.message;
    } else if (error.name === 'CloudConvertError') {
        errorMessage = `CloudConvert API Error: ${error.message}. Check server logs for details.`;
        errorDetails = error.response?.data;
        console.error('CloudConvert SDK Error Details:', errorDetails);
    }

    return NextResponse.json({ message: errorMessage, details: errorDetails }, { status: 500 });
  }
}