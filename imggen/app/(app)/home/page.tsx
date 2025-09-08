// app/page.tsx
"use client";

import Landing from "@/components/ui/section/landingPage";
import MemeGallery from "@/components/ui/section/MemeGallery";
import MemeInput from "@/components/ui/section/MemeInput";
export default function Home() {
  
  return (
    <main>
      <Landing />
      <MemeInput/>
      <MemeGallery />
    </main>
  );
}
