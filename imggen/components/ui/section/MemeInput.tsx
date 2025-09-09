"use client";

import { useState } from "react";
import FileUpload from "../UploadFile";
import InputField from "../InputField";
import { Button } from "../button";
import { motion } from "framer-motion";

export default function MemeInput() {
  const [image, setImage] = useState<File | null>(null);
  const [folderName, setFolderName] = useState("meme");

  const [description, setDescription] = useState("This is hilarious");

  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }

    formData.append("description", description);
    formData.append("folderName", folderName);

    setLoading(true);
    try {
      const res = await fetch("/api/imginput", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Job pushed successfully");
      } else {
        alert(data.error || "Error creating job");
      }
    } catch (e) {
      console.error("Job creation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 py-24 px-6 flex flex-col items-center">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight">
          Create Hilarious Memes in Seconds

        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600">
         Generate funny memes instantly - upload an image or type text. AI-powered, easy-to-use meme maker for quick laughs and social sharing!

        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 space-y-8 border border-slate-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        viewport={{ once: true }}
      >
        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload label="Image" onFileSelect={setImage} />
        </div>

        {/* Description */}
        <InputField
          label="Description"
          value={description}
          onChange={setDescription}
          textarea
        />

        {/* Folder & Iterations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Folder Name"
            value={folderName}
            onChange={setFolderName}
          />
        </div>

        {/* CTA Button */}
        <div className="pt-6 text-center">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-4 text-lg font-semibold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            {loading ? "Generating..." : "✨ Generate Meme"}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
