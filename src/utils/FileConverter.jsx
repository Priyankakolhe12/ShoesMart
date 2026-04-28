export const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file || typeof file === "string") return resolve(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
