// utils/cloudinaryUpload.js
export const uploadToCloudinary = async (file, resourceType = "auto") => {
  const url = `https://api.cloudinary.com/v1_1/ddbfao0dy/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("upload_preset", "ecommerce-unsigned");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return (await res.json()).secure_url;
};
