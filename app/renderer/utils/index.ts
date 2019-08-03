export function blobToBase64(blob: any) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const dataUrl = reader.result;
      resolve(dataUrl);
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}
