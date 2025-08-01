// src/app/api/upload-resume/route.js
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const resumeFile = formData.get('resume');
        const jobDescription = formData.get('jobDescription');

        if (!resumeFile || !jobDescription) {
            console.error("Missing resume file or job description in API request.");
            return NextResponse.json({ error: 'Resume file and job description are required.' }, { status: 400 });
        }

        const fileType = resumeFile.type;
        const fileName = resumeFile.name || 'unknown';
        let resumeContent = '';

        if (resumeFile instanceof Blob) {
            const arrayBuffer = await resumeFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            if (fileType === 'text/plain') {
                resumeContent = buffer.toString('utf8');

            } else if (fileType === 'application/pdf') {
                const pdfData = await pdfParse(buffer);
                resumeContent = pdfData.text;

            } else if (
                fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                const result = await mammoth.extractRawText({ buffer });
                resumeContent = result.value;

            } else {
                console.error("Unsupported file type:", fileType);
                return NextResponse.json({ error: 'Unsupported file type: ' + fileType }, { status: 400 });
            }
        } else {
            console.error("Invalid resume file format received in API.");
            return NextResponse.json({ error: 'Invalid resume file format.' }, { status: 400 });
        }

        console.log("--- Server Received Data ---");
        console.log("File Name:", fileName);
        console.log("File Type:", fileType);
        console.log("Job Description:", jobDescription);
        console.log("Resume File Content:\n", resumeContent.substring(0, 500) + (resumeContent.length > 500 ? '...' : ''));
        console.log("----------------------------");

        return NextResponse.json({
            message: 'File contents received and sent back successfully!',
            receivedJobDescription: jobDescription,
            receivedResumeContent: resumeContent
        }, { status: 200 });

    } catch (error) {
        console.error('Error in API route /api/upload-resume:', error);
        return new NextResponse(JSON.stringify({
            error: 'Failed to process request: ' + error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}