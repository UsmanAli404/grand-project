import { NextRequest } from 'next/server';

export async function POST(req = new NextRequest()) {
  const { latex } = await req.json();

  if (!latex || latex.trim() === "") {
    return new Response(JSON.stringify({ error: "Empty LaTeX input" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Full LaTeX document structure
  const fullLatex = `
\\documentclass[11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\hypersetup{colorlinks=true, urlcolor=blue}
\\begin{document}
${latex}
\\end{document}
`.trim(); // Trim leading/trailing newlines

  const blob = new Blob([fullLatex], { type: 'application/x-tex' });

  const formData = new FormData();
  formData.append('file', blob, 'main.tex'); // MUST be 'main.tex'
  formData.append('compiler', 'pdflatex');   // optional but explicit

  try {
    const res = await fetch('https://latexonline.cc/data?target=main.pdf', {
      method: 'POST',
      body: formData,
    });

    const buffer = await res.arrayBuffer();

    if (!res.ok) {
      const errorText = Buffer.from(buffer).toString('utf8');
      console.error("LatexOnline error output:\n", errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
        'Content-Length': buffer.byteLength.toString(),
      },
    });

  } catch (err) {
    console.error("Unexpected fetch error:", err.message);
    return new Response(JSON.stringify({ error: 'Unexpected server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}