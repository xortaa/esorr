"use client";

import { UserPlus, X } from "lucide-react";

const CreateOfficerSidebar = () => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <UserPlus />
          Add Officer
        </label>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <form className="menu bg-white min-h-full w-5/6 sm:w-4/6 xl:w-1/2 p-4 mt-20 overflow-auto">
          <div className="mb-4 relative">
            <label className="absolute top-0 right-4 btn btn-ghost" htmlFor="my-drawer">
              <X />
            </label>

            <h2 className="text-3xl font-bold">Officer Details</h2>
            <p className="text-sm text-slate-500">Enter the details below for the officer</p>
          </div>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                <label className="label mb-1">RELIGION</label>
                <input className="input input-bordered w-full uppercase" placeholder="DELA CRUZ" />
              </div>
              <div className="w-full">
                <label className="label mb-1">CITIZENSHIP</label>
                <input className="input input-bordered w-full uppercase" placeholder="FILIPINO" />
              </div>
              <div className="w-full">
                <label className="label mb-1">GENDER</label>
                <input className="input input-bordered w-full uppercase" placeholder="GONZALEZ" />
              </div>
            </div>
            <div>
              <div className="w-full">
                <label className="label mb-1">POSITION</label>
                <input className="input input-bordered w-full uppercase" placeholder="EXTERNAL VICE PRESIDENT" />
              </div>
              <div className="w-full">
                <label className="label mb-1">COLLEGE / FACULTY</label>
                <input className="input input-bordered w-full uppercase" placeholder="COLLEGE OF EDUCATION" />
              </div>
              <div className="w-full">
                <label className="label mb-1">PROGRAM / MAJOR</label>
                <input className="input input-bordered w-full uppercase" placeholder="BS FOOD TECHNOLOGY" />
              </div>
            </div>
            <div className="my-6">
              <h2 className="text-xl bg-black text-white text-center w-full">CONTACT DETAILS</h2>
              <div className="flex flex-wrap items-center justify-start gap-2 w-full">
                <div className="w-full sm:w-1/2">
                  <label className="label mb-1">MOBILE #</label>
                  <input className="input input-bordered w-full" placeholder="9082437102" />
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="label mb-1">RESIDENCE/HOME #</label>
                  <input className="input input-bordered w-full" placeholder="7976-8885" />
                </div>
                <div className="w-full">
                  <label className="label mb-1">EMAIL</label>
                  <input className="input input-bordered w-full" placeholder="johnallen.delacruz@ust.edu.ph" />
                </div>
                <div className="w-full">
                  <label className="label mb-1">FACEBOOK</label>
                  <input className="input input-bordered w-full" placeholder="facebook.com/johnallen.delacruz" />
                </div>
              </div>
            </div>
            <div className="my-6">
              <h2 className="text-xl bg-black text-white text-center w-full ">EDUCATIONAL BACKGROUND</h2>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-secondary">SECONDARY</h3>
                <div className="flex flex-wrap items-center justify-start gap-2 w-full">
                  <div className="w-full sm:w-1/2 lg:w-1/3">
                    <label className="label mb-1">YEAR OF GRADUATION</label>
                    <input className="input input-bordered w-full" placeholder="2022" />
                  </div>
                  <div className="w-full">
                    <label className="label mb-1">NAME AND LOCATION OF INSTITUTION</label>
                    <input className="input input-bordered w-full" placeholder="University of Santo Tomas, Manila" />
                  </div>
                  <div className="w-full">
                    <label className="label mb-1">ORGANIZATION / CLUB / SOCIETY</label>
                    <input
                      className="input input-bordered w-full"
                      placeholder="Society of Information Technology Enthusiasts"
                    />
                  </div>
                  <div className="w-full sm:w-1/2 lg:w-1/3">
                    <label className="label mb-1">POSITION</label>
                    <input className="input input-bordered w-full" placeholder="Staff" />
                  </div>
                </div>
              </div>
              <div className="mt-16">
                <h3 className="text-xl font-bold text-secondary">COLLEGE / MAJOR</h3>
                <div className="flex flex-wrap items-center justify-start gap-2 w-full">
                  <div className="w-full sm:w-1/2 lg:w-1/3">
                    <label className="label mb-1">YEAR OF GRADUATION</label>
                    <input className="input input-bordered w-full" placeholder="2022" />
                  </div>
                  <div className="w-full">
                    <label className="label mb-1">NAME AND LOCATION OF INSTITUTION</label>
                    <input className="input input-bordered w-full" placeholder="University of Santo Tomas, Manila" />
                  </div>
                  <div className="w-full">
                    <label className="label mb-1">ORGANIZATION / CLUB / SOCIETY</label>
                    <input
                      className="input input-bordered w-full"
                      placeholder="Society of Information Technology Enthusiasts"
                    />
                  </div>
                  <div className="w-full sm:w-1/2 lg:w-1/3">
                    <label className="label mb-1">POSITION</label>
                    <input className="input input-bordered w-full" placeholder="Staff" />
                  </div>
                </div>
              </div>
              <div className="mt-16">
                <h3 className="text-xl font-bold text-secondary">SPECIAL TRAINING</h3>
                <div className="flex flex-wrap items-center justify-start gap-2 w-full">
                  <div className="w-full sm:w-1/2 lg:w-1/3">
                    <label className="label mb-1">YEAR OF GRADUATION</label>
                    <input className="input input-bordered w-full" placeholder="2022" />
                  </div>
                  <div className="w-full">
                    <label className="label mb-1">NAME AND LOCATION OF INSTITUTION</label>
                    <input className="input input-bordered w-full" placeholder="University of Santo Tomas, Manila" />
                  </div>
                  <div className="w-full">
                    <label className="label mb-1">ORGANIZATION / CLUB / SOCIETY</label>
                    <input
                      className="input input-bordered w-full"
                      placeholder="Society of Information Technology Enthusiasts"
                    />
                  </div>
                  <div className="w-full sm:w-1/2 lg:w-1/3">
                    <label className="label mb-1">POSITION</label>
                    <input className="input input-bordered w-full" placeholder="Staff" />
                  </div>
                </div>
              </div>
            </div>
            <div className="my-6">
              <h2 className="text-xl bg-black text-white text-center w-full">OTHER INFORMATION</h2>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-secondary">RECORD OF EXTRA-CURRICULAR ACTIVITIES</h3>
                <h2 className="text-md font-bold text-secondary">(Inside and Outside of the University)</h2>
                <div className="flex flex-wrap items-center justify-start gap-2 w-full">
                  <div className="w-full">
                    <label className="label mb-1">INCLUSION DATE</label>
                    <div className="flex items-center gap-2">
                      <input className="input input-bordered w-full sm:max-w-xs" placeholder="2022" />
                      <span>-</span>
                      <input className="input input-bordered w-full sm:max-w-xs" placeholder="2022" />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <label className="label mb-1">NAME OF ORGANIZATION</label>
                  <input className="input input-bordered w-full" placeholder="University of Santo Tomas, Manila" />
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/3">
                  <label className="label mb-1">POSITION</label>
                  <input className="input input-bordered w-full" placeholder="Staff" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-secondary">RECORD OF EXTRA-CURRICULAR ACTIVITIES</h3>
                <h2 className="text-md font-bold text-secondary">(Inside and Outside of the University)</h2>
                <div className="flex flex-wrap items-center justify-start gap-2 w-full">
                  <div className="w-full">
                    <label className="label mb-1">INCLUSION DATE</label>
                    <div className="flex items-center gap-2">
                      <input className="input input-bordered w-full sm:max-w-xs" placeholder="2022" />
                      <span>-</span>
                      <input className="input input-bordered w-full sm:max-w-xs" placeholder="2022" />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <label className="label mb-1">NAME OF ORGANIZATION</label>
                  <input className="input input-bordered w-full" placeholder="University of Santo Tomas, Manila" />
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/3">
                  <label className="label mb-1">POSITION</label>
                  <input className="input input-bordered w-full" placeholder="Staff" />
                </div>
              </div>
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

export default CreateOfficerSidebar;
