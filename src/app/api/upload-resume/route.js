// src/app/api/upload-resume/route.js
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get('resume');
    const jobDescription = formData.get('jobDescription');

    if (!resumeFile || !jobDescription) {
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
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer });
        resumeContent = result.value;
      } else {
        return NextResponse.json({ error: 'Unsupported file type: ' + fileType }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid resume file format.' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: req.headers.get('authorization'),
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
    }

    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db();
    const collection = db.collection('resumes');

    await collection.insertOne({
      userId: user.id,
      resumeText: resumeContent,
      jobDesc: jobDescription,
      tailoredResume: null,
      createdAt: new Date()
    });

    await mongoClient.close();

    return NextResponse.json({
      message: 'File contents saved to MongoDB successfully!',
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