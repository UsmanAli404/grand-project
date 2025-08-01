// dashboard.js
'use client';

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Sun, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { checkAuthStatus } from "@/lib/auth";

export default function Dashboard() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState(""); // State for displaying messages to the user
  const [loading, setLoading] = useState(false); // State for loading indicator

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
      setMessage(""); // Clear any previous messages when a new file is dropped
    }
  }, []);

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      toast.warning("Job description missing", {
        description: "Please enter a job description.",
        duration: 4000,
        position: 'top-center',
      });
      return;
    }

    if (!resumeFile) {
      toast.warning("Upload required", {
        description: "Please upload a resume file.",
        duration: 4000,
        position: 'top-center',
      });
      return;
    }

    const { isAuthenticated, session } = await checkAuthStatus()

    if (!isAuthenticated) {
      toast.error("Authentication Error", {
        description: "You must be logged in to upload your resume.",
        duration: 4000,
        position: "top-center",
      });
      return;
    }

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
      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Non-JSON response received from server:", text);
        toast("Unexpected Server Response", {
          description: "Check the console for debugging info.",
          duration: 6000,
          position: 'top-center',
        });
        throw new Error("Unexpected server response format.");
      }

      if (!res.ok) {
        toast.error("Server Error", {
          description: data.error || "Failed to send data to server.",
          duration: 5000,
          position: 'top-center',
        });
        throw new Error(data.error || "Server communication failed.");
      }

      console.log("--- Client Received Data ---");
      console.log("Server Message:", data.message);
      console.log("Received Job Description:", data.receivedJobDescription);
      console.log("Received Resume Content:\n", data.receivedResumeContent.substring(0, 500) + (data.receivedResumeContent.length > 500 ? '...' : ''));
      console.log("--------------------------");

      toast.success("Success", {
        description: "Data sent and received successfully!",
        duration: 3000,
        position: 'top-center',
      });
    } catch (error) {
      console.error("Error in handleTailorResume:", error);
      toast.error("Error", {
        description: error.message,
        duration: 5000,
        position: "top-center"
      });
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
        <Button
          variant="link"
          className="text-xl font-bold hover:cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          NextHire
        </Button>

        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" aria-label="Toggle theme" className="hover:border-2 hover:cursor-pointer">
            <Sun className="w-5 h-5" />
          </Button>

          <Button size="icon" variant="ghost" aria-label="Profile" className="hover:border-2 hover:cursor-pointer">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-col max-w-2xl w-full mx-auto px-5 pt-5">
        <div className="mt-5 mb-4">
          <Label htmlFor="job-desc" className="text-2xl mb-3">Job Description</Label>
          <textarea
            id="job-desc"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            className="w-full min-h-40 lg:min-h-60 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            placeholder="Paste or write your job description here..."
          />
        </div>

        <div className="mb-4 relative">
          <Label className="text-2xl mb-3">Drop your Resume below</Label>

          <div
            {...getRootProps()}
            className="relative min-h-40 lg:min-h-60 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-8 text-center cursor-pointer hover:border-black transition-colors"
          >
            <input {...getInputProps()} />

            {resumeFile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setResumeFile(null);
                }}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {isDragActive ? (
              <p className="text-gray-600">Drop the files here ...</p>
            ) : resumeFile ? (
              <p className="text-gray-800">{resumeFile.name} selected</p>
            ) : (
              <p className="text-gray-600">
                Drag & drop a file here, or click to browse (.pdf, .txt, .doc, .docx)
              </p>
            )}
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-md text-center ${message.includes("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <Button onClick={handleTailorResume} disabled={loading}>
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {loading ? 'Sending Data...' : 'Send Data'}
        </Button>

      </div>
    </div>
  );
}