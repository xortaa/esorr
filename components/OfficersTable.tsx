"use client";

import { Trash2, Filter, Search, FilePenLine, Eye } from "lucide-react";
import CreateOfficerSidebar from "@/components/CreateOfficerSidebar";

const OfficersTable = () => {
  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center w-full my-4">
        <div className="flex items-center gap-4">
          <CreateOfficerSidebar />
        </div>
        <div className="flex items-center justify-center gap-2">
          <select className="select select-bordered w-full max-w-xs">
            <option disabled selected>
              Year Start
            </option>
            <option>2023</option>
            <option>2024</option>
          </select>
          <label className="input input-primary input-bordered border-primary flex items-center gap-2">
            <Search />
            <input type="text" className="grow" placeholder="Search..." />
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>PDF Preview</th>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <button className="btn btn-primary">
                  <Eye />
                </button>
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Hart Hagerty</div>
                  </div>
                </div>
              </td>
              <td>
                President
                <br />
                <span className="badge badge-primary badge-sm">AY 2024-2025</span>
              </td>
              <td className="text-error">Incomplete</td>
              <td>
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost">
                    <FilePenLine />
                  </button>
                  <button className="btn btn-ghost text-error">
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button className="btn btn-primary">
                  <Eye />
                </button>
              </td>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/3@94.webp"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Brice Swyre</div>
                  </div>
                </div>
              </td>
              <td>
                President
                <br />
                <span className="badge badge-ghost badge-sm">AY 2023-2024</span>
              </td>
              <td className="text-success">Complete</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OfficersTable;
