'use client';

import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { checkAuthStatus } from "@/lib/auth";
import { useRouter } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { ChevronDown } from "lucide-react";

export default function UploadResumePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
      setMessage("");
    }
  }, []);

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      toast.warning("Job description missing", { description: "Please enter a job description.", position: "top-center" });
      return;
    }

    if (!resumeFile) {
      toast.warning("Upload required", { description: "Please upload a resume file.", position: "top-center" });
      return;
    }

    const { isAuthenticated, session } = await checkAuthStatus();

    if (!isAuthenticated) {
      toast.error("Authentication Error", { description: "You must be logged in.", position: "top-center" });
      return;
    }

    if (!session.access_token) {
      toast.error("Session error", { description: "Invalid access token", position: "top-center" });
      return;
    }

    // const user = session?.user || null;

    setLoading(true);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    
    try {
      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) {
        toast.error("Server Error", { description: data.error, position: "top-center" });
        return;
      }

      toast.success("Success", { description: "Resume tailored successfully!", position: "top-center", duration: 2000 });

      localStorage.setItem('tailoredResume', JSON.stringify({
        tailoredText: data.tailoredText,
        tailoredLatex: data.tailoredLatex
      }));

      setTimeout(() => {
        router.push('/dashboard/tailored-resume');
      }, 2000);

    } catch (error) {
      toast.error("Error", { description: error.message, position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEntries = async () => {
      setLoadingEntries(true);
      const { isAuthenticated, session } = await checkAuthStatus();
      if (!isAuthenticated || !session?.access_token){
        setLoadingEntries(false);
        return;
      }

      try {
        const res = await fetch('/api/fetch-resumes', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setEntries(data.entries);
        } else {
          console.error("Fetch failed:", data.error);
        }
      } catch (err) {
        console.error("Error fetching entries:", err.message);
      } finally {
        setLoadingEntries(false);
      }
    };

    fetchEntries();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div className="flex flex-col max-w-5xl w-full mx-auto px-5 pt-5">
      <div className="mt-5 mb-4">
        <Label htmlFor="job-desc" className="text-lg md:text-2xl mb-3">Job Description</Label>
        <textarea
          id="job-desc"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={5}
          className="w-full min-h-40 lg:min-h-60 border border-gray-500 dark:text-white rounded-md p-3 text-sm resize-none"
          placeholder="Paste or write your job description here..."
        />
      </div>

      <div className="mb-4 relative">
      <Label className="text-lg md:text-2xl mb-3">Drop your Resume below</Label>

      <div
        {...getRootProps()}
        className="relative min-h-40 lg:min-h-60 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-8 text-center"
      >
        <input {...getInputProps()} />

        {resumeFile && (
          <Button
            size="icon"
            variant=""
            onClick={(e) => {
              e.stopPropagation();
              setResumeFile(null);
            }}
            className="absolute top-2 right-2 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {resumeFile ? (
          <p className="text-gray-800">{resumeFile.name}</p>
        ) : (
          <p className="text-gray-600">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop a file here, or click to browse (.pdf, .txt, .doc, .docx)"}
          </p>
        )}
      </div>
    </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md text-center ${message.includes("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <Button onClick={handleTailorResume} disabled={loading} className={"mb-4 hover:cursor-pointer"}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Tailoring Resume...' : 'Tailor Resume'}
      </Button>

      {entries.length > 0 && (
        <div className="flex justify-center mb-10">
        <ChevronDown className="arrow-down w-6 h-6"/>
        </div>
      )}

      {entries.length > 0 && (
        <Label className="text-lg md:text-2xl mb-4">Previously tailored resumes:</Label>
      )}

      {entries.length>0 && (
        <ScrollArea className="h-100 w-full rounded-md border p-2 mb-12 dark:border-white">
          <div className="space-y-2">
            {entries.map((entry, idx) => (
              <div
                key={idx}
                className="border border-gray-300 rounded-md p-3 text-sm bg-gray-50"
              >
                <div className="mb-1 dark:text-black">
                  <span className="font-medium">Job:</span>{" "}
                  {entry.jobDesc?.slice(0, 100)}...
                </div>
                <div className="mb-1 dark:text-black">
                  <span className="font-medium">Resume:</span>{" "}
                  {entry.resumeText?.slice(0, 100)}...
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
                <Button
                  variant={localStorage.getItem('theme') === 'dark' ? "default" : "default"}
                  size="sm"
                  className="mt-2 dark:text-white dark:bg-black hover:cursor-pointer"
                  onClick={() => router.push(`/dashboard/resume/${entry._id}`)}
                >
                  Detailed View
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

    </div>
  );
}