'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'katex/dist/katex.min.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCopy } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function TailoredResumePage() {
  const [tailored, setTailored] = useState(null);
  const [createdAt, setCreatedAt] = useState('');
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('tailoredResume');
    if (data) {
      setTailored(JSON.parse(data));
      localStorage.removeItem('tailoredResume');
    }

    const now = new Date();
    setCreatedAt(now.toLocaleString());
  }, []);

  const handleCopy = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} to clipboard`, {position: "top-center"});
  };

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

      <div className="flex gap-4 mb-6">
        <Button
          onClick={async () => {
            const res = await fetch('/api/latex-to-pdf', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ latex: tailored.tailoredLatex }),
            });

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.pdf';
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download PDF
        </Button>

        <Button
          onClick={async () => {
            const res = await fetch('/api/latex-to-pdf', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ latex: tailored.tailoredLatex }),
            });

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
          }}
        >
          View PDF
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-2">Your Resume Comparison</h1>
      <p className="text-muted-foreground mb-6">
      Compare the tailored resume with your original version.
      </p>


      <div className="relative">
        {/* 📋 Copy Button */}
        <div className="absolute right-0 -top-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const active = document.querySelector('[data-state="active"]');
              const value = active?.getAttribute('data-value');

              if (value === 'text') handleCopy(tailored.tailoredText, 'Tailored Text copied');
              else if (value === 'latex') handleCopy(tailored.tailoredLatex, 'LaTeX source copied');
              else if (value === 'original') handleCopy(tailored.originalText, 'Original Resume copied');
            }}
          >
            <ClipboardCopy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="text">Tailored (Text)</TabsTrigger>
            <TabsTrigger value="latex">Tailored (LaTeX)</TabsTrigger>
            <TabsTrigger value="origional">Origional Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap overflow-auto">
              {tailored.tailoredText}
            </pre>
          </TabsContent>

          <TabsContent value="latex">
            <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-sm overflow-auto">
              {tailored.tailoredLatex}
            </pre>
          </TabsContent>

          <TabsContent value="origional">
            <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap overflow-auto">
              {tailored.origionalText}
            </pre>
          </TabsContent>
        </Tabs>
      </div>

      {/* ⏰ Created At Timestamp */}
      <p className="text-sm text-muted-foreground text-right mt-4">
        Created at {createdAt}
      </p>
    </div>
  );
}