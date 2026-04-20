/**
 * Resizes an image dataUrl to a max dimension (default 1024px)
 * and returns a new dataUrl + base64 string.
 * Larger images don't improve Gemini accuracy but slow down the request.
 */
export function resizeImage(
  dataUrl: string,
  maxSize = 1600,
  quality = 0.92
): Promise<{ dataUrl: string; base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      const scale = Math.min(1, maxSize / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);

      const mimeType = 'image/jpeg';
      const resized = canvas.toDataURL(mimeType, quality);
      const base64 = resized.split(',')[1];
      resolve({ dataUrl: resized, base64, mimeType });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
