"use client";
import React from "react";
import { useSession } from "next-auth/react";

const page = () => {
  const { data: session, status } = useSession();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button className="btn btn-primary" onClick={() => console.log(session)}>click me </button>
    </div>
  );
};

export default page;
