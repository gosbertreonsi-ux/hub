import JSZip from 'jszip';
import { PROJECT_FILES } from './fileBundle';

export async function downloadProjectZip(filename = 'mizizi-social.zip'): Promise<void> {
  const zip = new JSZip();

  for (const [filePath, fileContent] of Object.entries(PROJECT_FILES)) {
    if (typeof fileContent === 'string') {
      zip.file(filePath, fileContent);
    } else if (fileContent && typeof fileContent === 'object' && fileContent.isBinary) {
      zip.file(filePath, fileContent.base64, { base64: true });
    }
  }

  // Also include a helpful README.md
  zip.file(
    'README.md',
    `# MIZIZI SOCIAL

A modern visual social media and creator platform for photo & video sharing, messaging, stories, and discovery.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Architecture
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Google Gemini AI Integration for captions and creator strategy
- Full multi-role social platform (User, Creator, Business, Admin)
`
  );

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function downloadSingleFile(filePath: string): void {
  const content = PROJECT_FILES[filePath];
  if (!content) return;

  let blob: Blob;
  if (typeof content === 'string') {
    blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  } else if (content.isBinary) {
    const byteCharacters = atob(content.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    blob = new Blob([byteArray], { type: 'application/octet-stream' });
  } else {
    return;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filePath.split('/').pop() || 'download';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
