import SetupPagesNavbar from "@/components/SetupPagesNavbar";

export default async function Layout({ children }) {
  return (
    <>
      <SetupPagesNavbar />
      {children}
    </>
  );
}
