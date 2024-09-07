import MembersTable from "@/components/MembersTable";
import OfficersTable from "@/components/OfficersTable";
import PageWrapper from "@/components/PageWrapper";

const AnnexA1Page = () => {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ANNEX B LIST OF MEMBERS DASHBOARD</h1>
        <p className="text-sm text-slate-500">
          Manage and create list of members. Use the table below to view existing list of members.
        </p>
      </div>
      <MembersTable />
    </PageWrapper>
  );
};
export default AnnexA1Page;
