"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { SquareUserRound, Building2, Megaphone, Laptop, CircleHelp, FileText, Users } from "lucide-react";

const SidebarLayoutComponent = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  console.log(session);

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
              <div className="menu bg-base text-base-content h-full w-16 flex-col items-start justify-start">
                <ul className="w-full">
                  <div className="border-b border-slate-400">
                    {session?.user.role === "RSO" && (
                      <>
                        <li className="my-6">
                          <Link href="/rso/annexes">
                            <FileText className="text-base-content hover:text-primary" />
                          </Link>
                        </li>
                        <li className="my-6">
                          <Link href="/rso/signatories">
                            <Users className="text-base-content hover:text-primary" />
                          </Link>
                        </li>
                      </>
                    )}
                    {session?.user.role === "OSA" && (
                      <li className="my-6">
                        <Link href="admin/accounts">
                          <SquareUserRound className="text-base-content hover:text-primary" />
                        </Link>
                      </li>
                    )}
                    {session?.user.role && session?.user.role !== "RSO" && (
                      <li className="my-6">
                        <Link href="admin/organizations">
                          <Building2 className="text-base-content hover:text-primary" />
                        </Link>
                      </li>
                    )}
                    {session?.user.role === "OSA" && (
                      <li className="my-6">
                        <Link href="admin/announcements">
                          <Megaphone className="text-base-content hover:text-primary" />
                        </Link>
                      </li>
                    )}
                  </div>

                  <div className="border-b border-slate-400">
                    <li className="my-6">
                      <Link href="/">
                        <Megaphone className="text-base-content hover:text-primary" />
                      </Link>
                    </li>
                    <li className="my-6">
                      <Link href="">
                        <Laptop className="text-base-content hover:text-primary" />
                      </Link>
                    </li>
                    <li className="my-6">
                      <Link href="">
                        <CircleHelp className="text-base-content hover:text-primary" />
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
