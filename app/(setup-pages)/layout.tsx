import SetupPagesNavbar from "@/components/SetupPagesNavbar";

export default async function Layout({ children }) {
  return (
    <>
      <SetupPagesNavbar />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">{children}</div>
    </>
  );
}
