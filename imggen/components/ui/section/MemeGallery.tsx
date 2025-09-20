"use client";

import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CloudinaryImage from "../CloudinaryImage";
import { Image } from "@/models/image.model";
import { useSession } from "next-auth/react";

const LIMIT = 8; // Customize how many images per page

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const session = useSession();
  // console.log("username", session.data?.user?.email);
  const fetchImages = async (page: number, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/images?page=${page}&limit=${LIMIT}`);
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err: unknown) {
      setError("Failed to load images.");
      console.error(
        err instanceof Error ? err.message : "Failed to load images"
      );
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchImages(page, true); // silent fetch, no loading spinner
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [page]);
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const renderPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={page === i}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <section className="py-12 bg-gray-100 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">
          Meme Gallery
        </h2>

        <p className="text-center mb-6 text-slate-600">
          Maximum of 5 image generations per user
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image._id} className="relative">
              <CloudinaryImage
                url={image.url}
                alt={image._id || "Image"}
                public_id={image.publicId}
              />
            </div>
          ))}
        </div>

        {/* {loading && (
          <p className="text-center mt-4 text-gray-600">Loading...</p>
        )} */}

        {!loading && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                  />
                </PaginationItem>

                {renderPageNumbers()}

                {page < totalPages && totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}
