"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="bg-black text-white flex items-center justify-between px-6 py-2 border-b-4 border-primary z-50 h-20">
      <div className="flex items-center justify-center gap-2">
        <Link href="/organizations" className="flex items-center justify-center gap-1">
          <Image src="/assets/logo.png" width={150} height={40} alt="logo" />
          <p className="text-sm lg:block hidden">Electronic Student Organization Recognition Requirements</p>
        </Link>
      </div>
      {session && (
        <div className="dropdown dropdown-bottom dropdown-end" ref={dropdownRef}>
          <div
            tabIndex={0}
            role="button"
            className="flex items-center justify-center gap-2 text-white py-2 px-4 cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="avatar">
              <div className="w-9 rounded-full">
                <img src={session?.user.image ?? "/assets/user-placeholder.png"} />
              </div>
            </div>
            <p className="text-sm">{session?.user.email}</p>
            <ChevronDown size={15} />
          </div>
          {isDropdownOpen && (
            <div
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow text-black"
            >
              <div className="flex flex-col items-center justify-center gap-1 mb-2">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={session?.user.image ?? "/assets/user-placeholder.png"} />
                  </div>
                </div>
                <p className="text-xl">{session?.user.email}</p>
                <p className="bg-primary rounded-box py-1 px-3 text-white text-xs">{session?.user.role}</p>
              </div>
              <div className="flex flex-col items-start justify-center my-2">
                <Link href={`/profile/${session?.user._id}`} className="p-4 w-full hover:bg-slate-200 rounded-lg">
                  Profile
                </Link>
              </div>
              <button
                className="btn btn-outline"
                onClick={() => {
                  signOut({ redirect: false }).then(() => {
                    router.push("/");
                  });
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;