"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import EmailForm from "./EmailForm";
import EmailList from "./EmailList";

export default function Page() {
  const [view, setView] = useState<"compose" | "list">("list");

  return (
    <PageWrapper>
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Announcements to RSOs</h1>
      <div className="flex justify-center space-x-4 mb-8">
        <button className={`btn ${view === "list" ? "btn-primary" : "btn-outline"}`} onClick={() => setView("list")}>
          Email List
        </button>
        <button
          className={`btn ${view === "compose" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setView("compose")}
        >
          Compose Email
        </button>
      </div>
      {view === "compose" ? <EmailForm emailToEdit={null} /> : <EmailList />}
    </PageWrapper>
  );
}
