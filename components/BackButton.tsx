"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button onClick={handleBack} className="btn btn-circle btn-outline" aria-label="Go back to previous page">
      <ArrowLeft className="h-6 w-6" />
    </button>
  );
}
