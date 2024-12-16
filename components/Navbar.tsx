"use client";

import { Menu, X, Bell, RefreshCw } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Notification {
  _id: string;
  text: string;
  date: Date;
  link: string;
  organization: string;
}

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const timestamp = new Date().getTime();
      const { data } = await axios.get(`/api/notifications?t=${timestamp}`);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
    if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
      setIsNotificationsOpen(false);
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
              {session?.user?.role === "OSA" && (
                <>
                  <li>
                    <Link href="/osa/manage-accounts" className="hover:text-primary">
                      Manage Accounts
                    </Link>
                  </li>
                  <li>
                    <Link href="/osa/manage-affiliation" className="hover:text-primary">
                      Manage Affiliation
                    </Link>
                  </li>
                  <li>
                    <Link href="/osa/manage-officer-in-charge" className="hover:text-primary">
                      Manage Officer In Charge
                    </Link>
                  </li>
                  <li>
                    <Link href="/osa/announcement" className="hover:text-primary">
                      Announcement
                    </Link>
                  </li>
                </>
              )}
              {session?.user?.role === "RSO" ? (
                session?.user?.organization ? (
                  <li>
                    <Link href={`/organizations/${session?.user?.organization}`}>Annexes</Link>
                  </li>
                ) : null
              ) : (
                <li>
                  <Link href="/organizations" className="hover:text-primary">
                    Organizations
                  </Link>
                </li>
              )}
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
          {session?.user?.role === "RSO" ? (
            session?.user?.organization ? (
              <li>
                <Link href={`/organizations/${session?.user?.organization}`}>Annexes</Link>
              </li>
            ) : null
          ) : (
            <li>
              <Link href="/organizations" className="hover:text-primary">
                Organizations
              </Link>
            </li>
          )}

          {session?.user?.role === "OSA" && (
            <>
              <li>
                <Link href="/osa/manage-accounts" className="hover:text-primary">
                  Manage Accounts
                </Link>
              </li>
              <li>
                <Link href="/osa/manage-affiliation" className="hover:text-primary">
                  Manage Affiliation
                </Link>
              </li>
              <li>
                <Link href="/osa/manage-officer-in-charge" className="hover:text-primary">
                  Manage Officer In Charge
                </Link>
              </li>
              <li>
                <Link href="/osa/announcement" className="hover:text-primary">
                  Announcement
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {session && (
          <>
            {session.user?.role === "OSA" && (
              <div className="dropdown dropdown-end mr-2" ref={notificationsRef}>
                <div tabIndex={0} className="btn btn-ghost btn-circle" onClick={toggleNotifications}>
                  <div className="indicator">
                    <Bell className="h-5 w-5" />
                    <span className="badge badge-sm badge-primary indicator-item">{notifications.length}</span>
                  </div>
                </div>
                {isNotificationsOpen && (
                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-80 text-black"
                  >
                    <li className="flex justify-end p-2">
                      <button onClick={fetchNotifications} className="btn btn-ghost btn-xs">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </button>
                    </li>
                    {notifications.map((notification) => {
                      const notificationDate = new Date(notification.date);
                      const formattedDate = notificationDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      const formattedTime = notificationDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      });
                      return (
                        <li key={notification._id}>
                          <Link href={notification.link} className="flex flex-col items-center justify-center border-b">
                            <a className="text-sm py-2">{notification.text}</a>
                            <p className="text-right text-xs text-slate-600">{`${formattedDate}, ${formattedTime}`}</p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
            <div className="dropdown dropdown-end" ref={dropdownRef}>
              <div tabIndex={0} className="btn flex items-center justify-center" onClick={toggleDropdown}>
                <span className="text-xs">{session?.user.email}</span>
                <label className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={session?.user.image ?? "/assets/user-placeholder.png"} alt="User avatar" />
                  </div>
                </label>
              </div>
              {isDropdownOpen && (
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black"
                >
                  <span className="text-slate-600 text-right">{session?.user.role}</span>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
