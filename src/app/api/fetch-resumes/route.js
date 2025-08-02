import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';

export async function GET(req) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: req.headers.get('authorization'),
          },
        }
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db();
    const collection = db.collection('resumes');

    const entries = await collection.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .project({ jobDesc: 1, resumeText: 1, createdAt: 1 })
      .toArray();

    await mongoClient.close();

    return NextResponse.json({ entries });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
