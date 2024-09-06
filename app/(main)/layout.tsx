import SidebarLayoutComponent from "@/components/SidebarLayoutComponent";

export default async function Layout({ children }) {
  return <SidebarLayoutComponent>{children}</SidebarLayoutComponent>;
}
