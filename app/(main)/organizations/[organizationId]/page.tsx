"use client";
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Printer, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BackButton from "@/components/BackButton";

type AnnexStatus = "completed" | "in_progress" | "locked";

interface Annex {
  code: string;
  title: string;
  link: string;
  status: AnnexStatus;
}

const AnnexesPage = () => {
  const [annexes, setAnnexes] = useState<Annex[]>([
    { code: "01", title: "Rules of Procedure for Recognition", link: "annex-01", status: "completed" },
    { code: "02", title: "Petition for Recognition", link: "annex-02", status: "in_progress" },
    {
      code: "A",
      title: "Student Organizations General Information Report",
      link: "annex-a",
      status: "in_progress",
    },
    { code: "A-1", title: "Officer's Information Sheet", link: "annex-a1", status: "in_progress" },
    { code: "B", title: "List of Members", link: "annex-b", status: "in_progress" },
    {
      code: "C",
      title: "Certification of the Articles of Association",
      link: "annex-c",
      status: "in_progress",
    },
    { code: "C-1", title: "Articles of Association", link: "annex-c1", status: "in_progress" },
    { code: "D", title: "Organizations Logo and Letterhead", link: "annex-d", status: "in_progress" },
    {
      code: "E",
      title: "Organization Operational Assessment Form",
      link: "annex-e",
      status: "in_progress",
    },
    {
      code: "E-1",
      title: "Financial Report Summary of Receipts and Disbursements",
      link: "annex-e1",
      status: "in_progress",
    },
    { code: "E-2", title: "Financial Report Liquidation Report", link: "annex-e2", status: "in_progress" },
    {
      code: "E-3",
      title: "Performance Assesment of Student Organizations/Councils (PASOC) Form",
      link: "annex-e3",
      status: "in_progress",
    },
    { code: "F", title: "Activities' Monitoring Form", link: "annex-f", status: "in_progress" },
    { code: "G", title: "Organization Adviser Nomination Form", link: "annex-g", status: "in_progress" },
    { code: "H", title: "Commitment to Anti-Hazing Law", link: "annex-h", status: "in_progress" },
    {
      code: "I",
      title: "Commitment to Responsible Use of Social Media",
      link: "annex-i",
      status: "in_progress",
    },
    { code: "J", title: "Commitment to Active Participation", link: "annex-j", status: "in_progress" },
    { code: "K", title: "Commitment to Care for the Environment", link: "annex-k", status: "in_progress" },
    {
      code: "L",
      title: "Commitment to Submit The Post Event Evaluation",
      link: "annex-l",
      status: "in_progress",
    },
  ]);

  const completedAnnexes = annexes.filter((annex) => annex.status === "completed").length;
  const progress = (completedAnnexes / annexes.length) * 100;

  return (
    <PageWrapper>
      <BackButton />
      <h1 className="text-3xl font-bold mb-4">Annexes Dashboard</h1>
      <p className="text-slate-500 mb-4">
        Welcome to the Annexes Dashboard! Here you can find all the annexes that you need to submit for your
        organization's recognition. You can print or download all annexes at once or individually.
      </p>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Overall Progress</h2>
          <span className="text-lg font-medium">
            {completedAnnexes} / {annexes.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="border bg-slate-100 mb-4 p-4 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Annexes</h2>
          <button className="btn btn-sm btn-neutral">
            <Printer className="mr-2" />
            Print All Annexes
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Initial Requirements</h3>
          <p className="text-sm text-slate-600 mb-4">Complete these annexes first to unlock the rest.</p>
          {annexes.slice(0, 2).map((annex) => (
            <AnnexDashboardAnnexCard key={annex.code} annex={annex} />
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Additional Annexes</h3>
          <p className="text-sm text-slate-600 mb-4">
            These annexes will be unlocked after completing the initial requirements.
          </p>
          {annexes.slice(2).map((annex) => (
            <AnnexDashboardAnnexCard key={annex.code} annex={annex} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

interface AnnexDashboardAnnexCardProps {
  annex: Annex;
}

const AnnexDashboardAnnexCard = ({ annex }: AnnexDashboardAnnexCardProps) => {
  const currentPath = usePathname();

  return (
    <Link
      href={annex.status !== "locked" ? `${currentPath}/${annex.link}` : "#"}
      className={`flex justify-between items-center p-4 hover:shadow-md hover:bg-white ${
        annex.status === "locked" ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center justify-center gap-4">
        <span
          className={`text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full ${
            annex.status === "completed"
              ? "bg-green-200 text-green-800"
              : annex.status === "in_progress"
              ? "bg-blue-200 text-blue-800"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {annex.status === "completed" ? (
            <CheckCircle size={20} />
          ) : annex.status === "locked" ? (
            <Lock size={20} />
          ) : (
            annex.code
          )}
        </span>
        <div>
          <p className="text-xl">{annex.title}</p>
          <p className="text-sm text-slate-500">
            {annex.status === "completed" ? "Completed" : annex.status === "in_progress" ? "In Progress" : "Locked"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AnnexesPage;
