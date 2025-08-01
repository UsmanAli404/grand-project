import pdfParse from 'pdf-parse';

/**
 * Extracts text content from a PDF file buffer.
 * @param {Object} file - The file object containing the PDF buffer and metadata.
 * @param {Buffer} file.buffer - The file buffer.
 * @param {string} file.mimetype - The MIME type (should be application/pdf).
 * @param {string} file.originalname - The original file name.
 * @returns {Promise<string>} The extracted text content.
 */
export async function extractText(file) {
  const { buffer, mimetype, originalname } = file;

  // Safety checks
  if (mimetype !== 'application/pdf') {
    throw new Error(`Unsupported file type: ${mimetype}`);
  }

  if (!Buffer.isBuffer(buffer)) {
    throw new Error('File buffer is not valid.');
  }

  try {
    const data = await pdfParse(buffer);
    const text = data.text?.trim();

    if (!text) {
      throw new Error('No text content found in the PDF.');
    }

    return text;
  } catch (err) {
    console.error(`❌ Error extracting text from ${originalname}:`, err);
    throw new Error(`Failed to extract text from PDF: ${err.message}`);
  }
}