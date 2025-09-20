'use client";';
import { ExternalLink, Trash2 } from "lucide-react"; // ExternalLink icon for opening the image
import { useSession } from "next-auth/react";

import { CldImage } from "next-cloudinary";

interface CloudinaryImageProps {
  url: string;
  alt?: string;
  public_id: string;
  className?: string;
  transformation?: string;
  showDownload?: boolean;
  showOpen?: boolean;
}

const CloudinaryImage = ({
  url,
  public_id,
  alt = "Image",
  className = "",
  // transformation = "f_auto,q_auto",
  // showDownload = true,
  showOpen = true,
}: CloudinaryImageProps) => {
  // const handleDownload = () => {
  //   const link = document.createElement("a");
  //   link.href = url; // original image URL
  //   link.download = url.split("/").pop() || "image.jpg"; // Set the default download name from the URL
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const session = useSession();
  const handleOpen = () => {
    window.open(url, "_blank");
  };
  
  const handleDelete = async (public_id: string) => {
    try {
      const response = await fetch(`/api/images`, {
        method: "DELETE",
        body: JSON.stringify({ public_id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete image");
      // Optionally, you can update the UI or state to remove the deleted image
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  return (
    <div className="relative group w-full h-full">
      {/* Open Button Icons */}
      {showOpen && (
        <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {session.data?.user?.email==="amankumarprasad72@gmail.com" && (
            <button
              onClick={() => handleDelete(public_id)}
              aria-label="Delete image"
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <Trash2 className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <button
            onClick={handleOpen}
            aria-label="Open image in a new tab"
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          >
            <ExternalLink className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      <CldImage
        width={1024}
        height={768}
        src={public_id}
        alt={`Cover ${url}-${alt}`}
        className={`w-full h-auto rounded-lg shadow object-cover ${className}`}
      />
    </div>
  );
};

export default CloudinaryImage;
