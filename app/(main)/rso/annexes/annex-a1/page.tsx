import OfficersTable from "@/components/OfficersTable";
import PageWrapper from "@/components/PageWrapper";

const AnnexA1Page = () => {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ANNEX A-1 OFFICER_S INFORMATION SHEET DASHBOARD</h1>
        <p className="text-sm text-slate-500">
          Manage and create officer information sheets for student organizations. Use the table below to view existing
          officer information sheets.
        </p>
      </div>
      <OfficersTable />
    </PageWrapper>
  );
};
export default AnnexA1Page;
