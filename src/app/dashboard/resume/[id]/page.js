'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { checkAuthStatus } from '@/lib/auth';
import { ClipboardCopy } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

export default function ResumeDetailPage() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!", {position: "top-center"});
    } catch (err) {
      toast.error("Failed to copy", {position: "top-center"});
    }
  };

  useEffect(() => {
    const fetchEntry = async () => {
      const { isAuthenticated, session } = await checkAuthStatus();
      if (!isAuthenticated || !session?.access_token) {
        toast.error("Authentication required", { description: "Please login to view this page." });
        router.push('/dashboard/upload-data');
        return;
      }

      try {
        const res = await fetch(`/api/fetch-resume?id=${params.id}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          setEntry(data.entry);
        } else {
          toast.error("Error", { description: data.error || "Resume not found." });
        }
      } catch (err) {
        toast.error("Error", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading detailed resume...
      </div>
    );
  }

  if (!entry) {
    return <div className="text-center mt-10 text-gray-600">Resume entry not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-5">
      <div className="mb-4">
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Label className="text-2xl font-semibold mb-4 block">Detailed Resume View</Label>

      <div className="border rounded-md p-4 space-y-4 text-sm">
        <div>
          <div className="flex items-center justify-between">
            <strong>Job Description:</strong>
            <Button size="icon" variant="outline" onClick={() => copyToClipboard(entry.jobDesc)}>
              <ClipboardCopy className="w-4 h-4" />
            </Button>
          </div>
          <p className="mt-2 whitespace-pre-wrap">{entry.jobDesc}</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <strong>Tailored Resume (Plain Text):</strong>
            <Button size="icon" variant="outline" onClick={() => copyToClipboard(entry.tailoredResumeText)}>
              <ClipboardCopy className="w-4 h-4" />
            </Button>
          </div>
          {/* <p className="mt-1 whitespace-pre-wrap">{entry.tailoredResumeText}</p> */}
          <pre className="mt-2 p-2 rounded border overflow-x-auto text-sm">{entry.tailoredResumeText}</pre>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <strong>Tailored Resume (LaTeX):</strong>
            <Button size="icon" variant="outline" onClick={() => copyToClipboard(entry.tailoredResumeLatex)}>
              <ClipboardCopy className="w-4 h-4" />
            </Button>
          </div>
          <pre className="mt-2 p-2 rounded border overflow-x-auto text-sm">{entry.tailoredResumeLatex}</pre>
        </div>

        <div className="text-xs text-gray-500">
          Created: {new Date(entry.createdAt).toLocaleString()}
        </div>
      </div>


    </div>
  );
}