"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SquareUserRound, Building2, Megaphone, Laptop, CircleHelp, FileText, Users } from "lucide-react";

const SidebarLayoutComponent = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();

  return (
    <div className="relative flex flex-col h-full">
      <Navbar setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col z-0 h-full">
        <div className="flex flex-1 h-full">
          <div className={`drawer ${sidebarOpen ? "lg:drawer-open" : "lg:drawer-close"} h-full`}>
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col h-full overflow-auto">{children}</div>
            <div className="drawer-side z-0 h-full">
              <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
              <div className="menu bg-base text-base-content h-full w-80 flex-col items-start justify-start gap-2 overflow-auto">
                <p className="text-lg">Menu</p>
                {session && (
                  <Link className="w-full" href="/profile">
                    <div className="flex items-center justify-start gap-2 p-2 w-full">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={session?.user.image ?? "/assets/user-placeholder.png"} />
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-center flex-wrap">
                        <p>{session?.user.email}</p>
                      </div>
                    </div>
                  </Link>
                )}
                <ul className="w-full">
                  {session?.user.role === "OSA" && (
                    <>
                      <li className="hover:text-white">
                        <Link href="admin/accounts">
                          <FileText className="text-primary" />
                          Annexes
                        </Link>
                      </li>
                      <li className="hover:text-white">
                        <Link href="admin/accounts">
                          <Users className="text-primary" />
                          Organization Member Accounts
                        </Link>
                      </li>
                    </>
                  )}
                  {session?.user.role === "OSA" && (
                    <li className="hover:text-white">
                      <Link href="admin/accounts">
                        <SquareUserRound className="text-primary" />
                        Manage Accounts
                      </Link>
                    </li>
                  )}
                  {session?.user.role && session?.user.role !== "RSO" && (
                    <li className="hover:text-white">
                      <Link href="admin/organizations">
                        <Building2 className="text-primary" />
                        Manage Organizations
                      </Link>
                    </li>
                  )}
                  {session?.user.role === "OSA" && (
                    <li className="hover:text-white">
                      <Link href="admin/announcements">
                        <Megaphone className="text-primary" />
                        Manage Announcements
                      </Link>
                    </li>
                  )}
                  <div className="border-b border-slate-400 border-t mt-2">
                    <li className="hover:text-white">
                      <Link href="/">
                        <Megaphone className="text-primary" />
                        Announcements
                      </Link>
                    </li>
                    <li className="hover:text-white">
                      <Link href="">
                        <Laptop className="text-primary" />
                        About
                      </Link>
                    </li>
                    <li className="hover:text-white">
                      <Link href="">
                        <CircleHelp className="text-primary" />
                        FAQ
                      </Link>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SidebarLayoutComponent;