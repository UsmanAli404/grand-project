'use client';

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, User } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const router = useRouter();

  // Dropzone config
  const onDrop = useCallback((acceptedFiles) => {
    console.log("Uploaded files:", acceptedFiles);
    // You can send these files to your API or Supabase storage here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc', '.docx']
    }
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
        <Button
          variant="link"
          className="text-xl font-bold hover:cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          NextHire
        </Button>

        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" aria-label="Toggle theme" className={"hover:border-2 hover:cursor-pointer"}>
            <Sun className="w-5 h-5 "/>
            {/* Optional: conditionally switch to <Moon /> based on theme */}
          </Button>

          <Button size="icon" variant="ghost" aria-label="Profile"  className={"hover:border-2 hover:cursor-pointer"}>
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Label className={"text-2xl mb-5"}>Drop your Resume in the Box below 👇</Label>

        <div
          {...getRootProps()}
          className="min-h-64 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-8 text-center cursor-pointer hover:border-black transition-colors"
        >
          <input {...getInputProps()} />
          {
            isDragActive ? (
              <p className="text-gray-600">Drop the files here ...</p>
            ) : (
              <p className="text-gray-600">
                Drag & drop a file here, or click to browse (.pdf, .txt, .doc)
              </p>
            )
          }
        </div>
      </main>
    </div>
  );
}