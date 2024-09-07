"use client";

import { Trash2, Filter, Search, FilePenLine, Eye } from "lucide-react";
import CreateMemberSidebar from "@/components/CreateMemberSidebar";

const MembersTable = () => {
  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center w-full my-4">
        <div className="flex items-center gap-4">
          <CreateMemberSidebar />
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
              <th></th>
              <th>Name</th>
              <th>Student Number</th>
              <th>Program</th>
              <th>Start Year</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>Alameda, Prince Alec Santos</td>
              <td>2023-189138</td>
              <td>BS FOOD TECHNOLOGY</td>
              <td>2024</td>
              <td>
                <div className="flex items-center gap-1">
                  <button className="btn btn-link text-black">
                    <FilePenLine />
                  </button>
                  <button className="btn btn-link text-black">
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>2</th>
              <td>Alameda, Prince Alec Santos</td>
              <td>2023-189138</td>
              <td>BS FOOD TECHNOLOGY</td>
              <td>2023</td>
            </tr>
            <tr>
              <th>3</th>
              <td>Alameda, Prince Alec Santos</td>
              <td>2023-189138</td>
              <td>BS FOOD TECHNOLOGY</td>
              <td>2023</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MembersTable;
