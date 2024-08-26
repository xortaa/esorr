import UsersTable from "@/components/UsersTable";

const AccountsPage = () => {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Accounts Dashboard</h1>
      <p className="text-sm text-slate-500">
        Manage and create accounts for users. Use the table below to view existing accounts.
      </p>
      <UsersTable />
    </div>
  );
};

export default AccountsPage;
