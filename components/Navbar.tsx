"use client";

import AvatarBubble from "./AvatarBubble";
import { usePathname } from "next/navigation";
import { useSession} from "next-auth/react";
import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (pathname === "/") {
    return;
  }

  return (
    <div className="bg-base-content text-base-100 w-full h-20 flex justify-between items-center py-2 px-12 text-md">
      <div className="flex items-center justify-center gap-4">
        <p>Dashboard</p>
        <p>Annexes</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <details className="dropdown dropdown-bottom dropdown-end ">
          <summary className="flex items-center cursor-pointer outline-none gap-2">
            <AvatarBubble image={session?.user.image} />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow text-base-content">
            <div className="flex items-center gap-2 p-4 border-b border-slate-300">
              <span className="bg-slate-300 text-slate-50 rounded-sm px-1 font-bold text-xs">RSO</span>
              <p className="text-md">{session?.user.email}</p>
            </div>
            <li>
              <div className="flex items-center">
                <User />
                <p>Profile</p>
              </div>
            </li>
            <li>
              <div className="flex items-center" onClick={() => signOut({ callbackUrl: "/", redirect: true })}>
                <LogOut />
                <p>Sign out</p>
              </div>
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
};
export default Navbar;
