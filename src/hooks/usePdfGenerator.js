import { useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import { compressImage } from '../utils/fileHelpers';

export const usePdfGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generatePdf = useCallback(async (images, settings) => {
    if (!images.length) {
      setError('No images to export');
      return;
    }

    const { orientation, pageSize, margin } = settings;

    try {
      setError(null);
      setIsGenerating(true);

      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
        compress: true,
      });

      for (let i = 0; i < images.length; i += 1) {
        const image = images[i];
        const processed = await compressImage(image.preview);

        if (i > 0) {
          pdf.addPage(pageSize, orientation);
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;

        // Keep original proportion by fitting image inside the available content box.
        const widthRatio = availableWidth / processed.width;
        const heightRatio = availableHeight / processed.height;
        const scale = Math.min(widthRatio, heightRatio);

        const renderWidth = processed.width * scale;
        const renderHeight = processed.height * scale;
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        pdf.addImage(
          processed.dataUrl,
          'JPEG',
          x,
          y,
          renderWidth,
          renderHeight
        );
      }

      pdf.save('Pix2Pdf-export.pdf');
    } catch (err) {
      setError(err.message || 'Failed to generate PDF');
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { isGenerating, generatePdf, error, setError };
};