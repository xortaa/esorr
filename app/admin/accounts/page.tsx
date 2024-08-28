import UsersTable from "@/components/UsersTable";
import PageWrapper from "@/components/PageWrapper";

const AccountsPage = () => {
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold">Accounts Dashboard</h1>
      <p className="text-sm text-slate-500">
        Manage and create accounts for users. Use the table below to view existing accounts.
      </p>
      <UsersTable />
    </PageWrapper>
  );
};

export default AccountsPage;
