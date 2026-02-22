export function cdnImage(url, transform) {
  if (!url) return url;

  // Only transform Cloudinary URLs; leave /uploads/... and external URLs untouched
  const marker = "/image/upload/";
  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) return url;

  // Insert transform right after /image/upload/
  return url.replace(marker, `${marker}${transform}/`);
}