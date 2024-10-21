"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar bg-black text-white border-b-4 border-primary z-50">
      <div className="navbar-start">
        <div className="dropdown" ref={menuRef}>
          <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </label>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black rounded-box w-52">
              <li>
                <Link href="/organizations" className="hover:text-primary">
                  Organizations
                </Link>
              </li>
              <li>
                <Link href="/manage-signatories" className="hover:text-primary">
                  Manage Signatories
                </Link>
              </li>
              <li>
                <Link href="/manage-accounts" className="hover:text-primary">
                  Manage Accounts
                </Link>
              </li>
              <li>
                <Link href="/manage-affiliation" className="hover:text-primary">
                  Manage Affiliation
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary">
                  Profile
                </Link>
              </li>
            </ul>
          )}
        </div>
        <Link href="/organizations" className="flex items-center space-x-2">
          <Image
            src="/assets/logo.png"
            width={200}
            height={50}
            alt="OFFICE FOR STUDENT AFFAIRS E-SORR"
            className="w-auto h-8 md:h-12"
          />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/organizations" className="hover:text-primary">
              Organizations
            </Link>
          </li>
          <li>
            <Link href="/manage-signatories" className="hover:text-primary">
              Manage Signatories
            </Link>
          </li>
          <li>
            <Link href="/manage-accounts" className="hover:text-primary">
              Manage Accounts
            </Link>
          </li>
          <li>
            <Link href="/manage-affiliation" className="hover:text-primary">
              Manage Affiliation
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-primary">
              Profile
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {session && (
          <div className="dropdown dropdown-end" ref={dropdownRef}>
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar" onClick={toggleDropdown}>
              <div className="w-10 rounded-full">
                <img src={session?.user.image ?? "/assets/user-placeholder.png"} alt="User avatar" />
              </div>
            </label>
            {isDropdownOpen && (
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
              >
                <li>
                  <Link href={`/profile/${session?.user._id}`} className="justify-between">
                    Profile
                    <span className="badge">{session?.user.role}</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      signOut({ redirect: false }).then(() => {
                        router.push("/");
                      });
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
