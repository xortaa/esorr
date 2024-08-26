"use client";

import { Trash2, Filter, Search } from "lucide-react";
import CreateAccountSidebar from "./CreateAccountSidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "@/types";

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="h-full w-full mt-24">
      <div className="flex justify-between items-center w-full my-4">
        <div className="flex items-center justify-center gap-2">
          <button className="btn btn-ghost">
            <Filter />
            Filter
          </button>
          <label className="input input-primary input-bordered border-primary flex items-center gap-2">
            <Search />
            <input type="text" className="grow" placeholder="Search..." />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <CreateAccountSidebar setUsers={setUsers}/>
          <button className="btn btn-neutral hover:shadow-lg hover:shadow-error">
            <Trash2 />
            Archive Account
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Email</th>
              <th>Org & Affiliation</th>
              <th>Accreditation Code</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user._id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={user.image ?? "/assets/user-placeholder.png"} alt="avatar" />
                      </div>
                    </div>
                    <div>
                      <div>{user.email}</div>
                      <div className="text-sm opacity-50">{user.role}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {user.organization?.name ?? "N/A"}
                  <br />
                  <span className="badge badge-ghost badge-sm text-xs">{user.affiliation ?? "N/A"}</span>
                </td>
                <td>{user.organization?.accreditation_code ?? "N/A"}</td>
                <th>
                  <button className="btn btn-ghost btn-xs">details</button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UsersTable;
