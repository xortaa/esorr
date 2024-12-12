"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import EmailForm from "../EmailForm";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";

export default function ComposePage() {
  const [emailToEdit, setEmailToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      fetchEmail(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/emails/${emailId}`);
      if (response.ok) {
        const data = await response.json();
        setEmailToEdit(data);
      } else {
        console.error("Failed to fetch email");
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      <BackButton />
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          {id ? "Edit Announcement" : "Create New Announcement"}
        </h1>
        <EmailForm emailToEdit={emailToEdit} />
    </PageWrapper>
  );
}
