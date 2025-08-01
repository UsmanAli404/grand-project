// dashboard.js
'use client';

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Sun, User } from "lucide-react";
import { Label } from "@/components/ui/label";

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
    // Client-side validation
    if (!resumeFile) {
      setMessage("Please upload a resume file.");
      console.error("No resume file uploaded.");
      return;
    }
    if (!jobDescription.trim()) {
      setMessage("Please enter a job description.");
      console.error("No job description entered.");
      return;
    }

    setMessage("Sending data to server...");
    setLoading(true); // Set loading state to true

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      // Read the response text first
      let text = await res.text();
      let data;

      // Attempt to parse as JSON, handle non-JSON responses
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Non-JSON response received from server:", text);
        setMessage("Server returned an unexpected response format. Check console for details.");
        throw new Error("Unexpected server response format.");
      }

      if (!res.ok) {
        // If response is not OK (e.g., 400, 500 status)
        setMessage(data.error || "Failed to send data to server.");
        throw new Error(data.error || "Server communication failed.");
      } else {
        // If response is OK
        console.log("--- Client Received Data ---");
        console.log("Server Message:", data.message);
        console.log("Received Job Description:", data.receivedJobDescription);
        console.log("Received Resume Content:\n", data.receivedResumeContent.substring(0, 500) + (data.receivedResumeContent.length > 500 ? '...' : '')); // Print first 500 chars
        console.log("--------------------------");
        setMessage("Data sent and received successfully! Check console for details.");
      }
    } catch (error) {
      console.error("Error in handleTailorResume:", error);
      // Update message for user, ensuring it doesn't overwrite specific error messages
      if (!message.includes("Unexpected server response")) {
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false); // Reset loading state
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

        <div className="mb-4">
          <Label className="text-2xl mb-3">Drop your Resume below</Label>
          <div
            {...getRootProps()}
            className="min-h-40 lg:min-h-60 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-8 text-center cursor-pointer hover:border-black transition-colors"
          >
            <input {...getInputProps()} />
            {
              isDragActive
                ? <p className="text-gray-600">Drop the files here ...</p>
                : resumeFile
                  ? <p className="text-gray-800">{resumeFile.name} selected</p>
                  : <p className="text-gray-600">Drag & drop a file here, or click to browse (.pdf, .txt, .doc, .docx)</p>
            }
          </div>
        </div>

        {/* Message display area */}
        {message && (
          <div className={`mb-4 p-3 rounded-md text-center ${message.includes("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <Button onClick={handleTailorResume} disabled={loading}>
          {loading ? 'Sending Data...' : 'Send Data'}
        </Button>
      </div>
    </div>
  );
}