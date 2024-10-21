"use client";

import React from "react";
import Annex01 from "@/app/pdf/annex-01/page";
import Annex02 from "@/app/pdf/annex-02/page";
import AnnexD from "@/app/pdf/annex-D/page";
import AnnexG from "@/app/pdf/annex-G/page";
import AnnexH from "@/app/pdf/annex-H/page";
import AnnexI from "@/app/pdf/annex-I/page";
import AnnexJ from "@/app/pdf/annex-J/page";
import AnnexK from "@/app/pdf/annex-K/page";
import AnnexL from "@/app/pdf/annex-L/page";

const PDFPage = () => {
  return (
    <div className="min-h-screen space-y-5 p-16">
      <h1 className="text-2xl font-bold">List of Completed PDFs</h1>
      <h2 className="text-xl font-bold text-primary">Annex01</h2>
      <Annex01 />
      <h2 className="text-xl font-bold text-primary">Annex02</h2>
      <Annex02 />
      <h2 className="text-xl font-bold text-primary">AnnexD</h2>
      <AnnexD />
      <h2 className="text-xl font-bold text-primary">AnnexG</h2>
      <AnnexG />
      <h2 className="text-xl font-bold text-primary">AnnexH</h2>
      <AnnexH />
      <h2 className="text-xl font-bold text-primary">AnnexI</h2>
      <AnnexI />
      <h2 className="text-xl font-bold text-primary">AnnexJ</h2>
      <AnnexJ />
      <h2 className="text-xl font-bold text-primary">AnnexK</h2>
      <AnnexK />
      <h2 className="text-xl font-bold text-primary">AnnexL</h2>
      <AnnexL />
    </div>
  );
};

export default PDFPage;
