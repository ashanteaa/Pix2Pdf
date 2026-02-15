# Pix2Pdf
link: https://pix2pdf.vercel.app/

Pix2Pdf is a pastel-themed React app that converts multiple images into a single downloadable PDF.

## Features

- Multi-image upload (JPG, JPEG, PNG, WEBP)
- Drag-and-drop reordering
- Image preview grid and per-image removal
- PDF generation with `jsPDF`
- Image compression before adding to PDF
- Orientation (portrait/landscape), page size (/A3/A4/A5/LegalLetter), and margin settings
- Loading state during export
- Friendly validation errors for unsupported or oversized files
- Optional dark pastel mode
- Responsive, reusable component-driven UI

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Open the local URL shown by Vite in your terminal.
