"use client";

import { UserPlus, X } from "lucide-react";

const CreateMemberSidebar = () => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <UserPlus />
          Add Member
        </label>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <form className="menu bg-white min-h-full w-5/6 sm:w-4/6 xl:w-1/2 p-4 mt-20 overflow-auto">
          <div className="mb-4 relative">
            <label className="absolute top-0 right-4 btn btn-ghost" htmlFor="my-drawer">
              <X />
            </label>

            <h2 className="text-3xl font-bold">Member Details</h2>
            <p className="text-sm text-slate-500">Enter the details below for the member</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="w-full">
              <label className="label mb-1">SURNAME</label>
              <input className="input input-bordered w-full uppercase" placeholder="DELA CRUZ" />
            </div>
            <div className="w-full">
              <label className="label mb-1">FIRST NAME</label>
              <input className="input input-bordered w-full uppercase" placeholder="JUAN MIGUEL" />
            </div>
            <div className="w-full">
              <label className="label mb-1">MIDDLE NAME</label>
              <input className="input input-bordered w-full uppercase" placeholder="GONZALEZ" />
            </div>
            <div className="w-full">
              <label className="label mb-1">STUDENT NUMBER</label>
              <input className="input input-bordered w-full uppercase" placeholder="2021148086" />
            </div>
            <div className="w-full">
              <label className="label mb-1">START YEAR</label>
              <select className="select select-bordered w-full">
                <option disabled selected>
                  SELECT
                </option>
                <option>2023</option>
                <option>2024</option>
              </select>
            </div>
            <div className="w-full">
              <label className="label mb-1">PROGRAM</label>
              <input className="input input-bordered w-full uppercase" placeholder="BS FOOD TECHNOLOGY" />
            </div>
            <button
              className="btn btn-primary w-full font-bold mt-6 hover:shadow-lg text-white"
              onClick={(e) => e.preventDefault()}
            >
              ADD OFFICER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMemberSidebar;
