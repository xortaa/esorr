import PageWrapper from "@/components/PageWrapper";
import AnnexDashboardAnnexCard from "@/components/AnnexDashboardAnnexCard";
import { Printer } from "lucide-react";

const AnnexesPage = () => {
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-4">Annexes Dashboard</h1>

      <div className="inline-flex items-center justify-center gap-2 rounded-sd bg-slate-100 p-1">
        <span className="text-sm bg-white py-1 px-2 rounded-sm">Incomplete</span>
        <span className="text-sm opacity-50 py-1 px-2">For Review</span>
        <span className="text-sm opacity-50 py-1 px-2">Ready For Printing</span>
      </div>

      <div className="border bg-slate-100 my-4 p-4 rounded-sm">
        <h1 className="text-2xl mb-4">Annexes</h1>
        <div className="flex items-center justify-start gap-2">
          <button className="btn btn-neutral">
            <Printer />
            Print All Annexes
          </button>
          <button className="btn btn-primary">
            <Printer />
            Download All Annexes
          </button>
        </div>
        <AnnexDashboardAnnexCard
          annexCode="01"
          annexTitle="Rules of Procedure for Recognition"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="02"
          annexTitle="Petition for Recognition"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="A"
          annexTitle="Student Organizations General Information Report"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="A-1"
          annexTitle="Officer_s Information Sheet"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="B"
          annexTitle="List of Members"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="C"
          annexTitle="Certification of the Articles of Association"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="C-1"
          annexTitle="Articles of Association"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="D"
          annexTitle="Organizations Logo and Letterhead"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="E"
          annexTitle="Organization Operational Assesment Form"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="E-1"
          annexTitle="Financial Report Summary of Receipts and Disbursements"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="E-2"
          annexTitle="Financial Report Liquidation Report"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="E-3"
          annexTitle="Pasoc Forms"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="F"
          annexTitle="Activities_ Monitoring Form"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="G"
          annexTitle="Organization Adviser Nomination Form"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="H"
          annexTitle="Commitment to Anti-Hazing Law"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="I"
          annexTitle="Commitment to Responsible Use of Social Media"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="J"
          annexTitle="Commitment to Active Participation"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="K"
          annexTitle="COMMITMENT TO CARE FOR THE ENVIRONMENT"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
        <AnnexDashboardAnnexCard
          annexCode="L"
          annexTitle="COMMITMENT TO SUBMIT THE POST EVENT EVALUATION"
          annexStatus="Incomplete"
          annexEditLink=""
          annexViewLink=""
        />
      </div>
    </PageWrapper>
  );
};
export default AnnexesPage;
