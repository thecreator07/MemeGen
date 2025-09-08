export async function uploadImages(params: {
  product: File;
  template: File;
  headline: string;
  description: string;
  cta: string;
  folderName: string;
  iterations: number;
}): Promise<string[]> {
  const formData = new FormData();
  formData.append("product", params.product);
  formData.append("template", params.template);
  formData.append("headline", params.headline);
  formData.append("description", params.description);
  formData.append("cta", params.cta);
  formData.append("folderName", params.folderName);
  formData.append("iterations", String(params.iterations));

  const res = await fetch("/api/imginput", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.jobIds || [];
}
