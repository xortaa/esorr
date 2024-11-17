"use client";

import { useSession } from "next-auth/react";

export default function CheckSession() {
  const { data: session } = useSession();

  const handleCheckSession = () => {
    console.log("Current session:", session);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button className="btn btn-primary" onClick={handleCheckSession}>
        Check Session
      </button>
    </div>
  );
}
