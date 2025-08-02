'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TailoredResumePage() {
  const [tailored, setTailored] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('tailoredResume');
    if (data) {
      setTailored(JSON.parse(data));
      localStorage.removeItem('tailoredResume');
    }
  }, []);

  if (!tailored) {
    return <p className="text-center mt-10">Loading tailored resume...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* 🔙 Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 flex items-center gap-2"
        onClick={() => router.push('/dashboard/upload-data')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">Your Tailored Resume</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Plain Text Version</h2>
        <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
          {tailored.tailoredText}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">LaTeX Version (Formatted)</h2>
        <div className="bg-gray-100 p-4 rounded-md overflow-auto">
          <BlockMath math={tailored.tailoredLatex} />
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Raw LaTeX Source</h2>
        <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-sm">
          {tailored.tailoredLatex}
        </pre>
      </div>
    </div>
  );
}