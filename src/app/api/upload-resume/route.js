// src/app/api/upload-resume/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Parse the form data from the request
        const formData = await req.formData();
        const resumeFile = formData.get('resume');
        const jobDescription = formData.get('jobDescription');

        // Validate inputs
        if (!resumeFile || !jobDescription) {
            console.error("Missing resume file or job description in API request.");
            return NextResponse.json({ error: 'Resume file and job description are required.' }, { status: 400 });
        }

        // Read the resume file content
        let resumeContent = '';
        if (resumeFile instanceof Blob) {
            const arrayBuffer = await resumeFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            resumeContent = buffer.toString('utf8'); // Assuming text-based content
        } else {
            console.error("Invalid resume file format received in API.");
            return NextResponse.json({ error: 'Invalid resume file format.' }, { status: 400 });
        }

        // Print file contents and job description on the server console
        console.log("--- Server Received Data ---");
        console.log("Job Description:", jobDescription);
        console.log("Resume File Content:\n", resumeContent.substring(0, 500) + (resumeContent.length > 500 ? '...' : '')); // Print first 500 chars
        console.log("--------------------------");

        // Send the contents back to the dashboard
        return NextResponse.json({
            message: 'File contents received and sent back successfully!',
            receivedJobDescription: jobDescription,
            receivedResumeContent: resumeContent
        }, { status: 200 });

    } catch (error) {
        console.error('Error in API route /api/upload-resume:', error);
        return NextResponse.json({ error: 'Failed to process request: ' + error.message }, { status: 500 });
    }
}