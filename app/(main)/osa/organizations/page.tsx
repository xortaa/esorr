"use client";

import { useState } from "react";
import { Search, Filter, LayoutGrid, List, Bell } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const OrganizationsPage = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const organizations = [
    {
      id: 1,
      name: "Sports Innovation And Technology Experts",
      status: "For Revision",
      image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGmtJ00yAfSTtgk2yPubOYVV0zK80A_Hog8JrtXr_1zwSxqsHA",
    },
    {
      id: 1,
      name: "Sports Innovation And Technology Experts",
      status: "Pending",
      image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGmtJ00yAfSTtgk2yPubOYVV0zK80A_Hog8JrtXr_1zwSxqsHA",
    },
    {
      id: 1,
      name: "Sports Innovation And Technology Experts",
      status: "Active",
      image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGmtJ00yAfSTtgk2yPubOYVV0zK80A_Hog8JrtXr_1zwSxqsHA",
    },
    {
      id: 1,
      name: "Sports Innovation And Technology Experts",
      status: "For Revision",
      image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGmtJ00yAfSTtgk2yPubOYVV0zK80A_Hog8JrtXr_1zwSxqsHA",
    },
  ];

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">Organizations</h1>
          <p className="text-lg text-gray-600 mt-2">Browse all student organizations</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="join">
            <button className={`btn join-item ${isGridView ? "btn-active" : ""}`} onClick={() => setIsGridView(true)}>
              <LayoutGrid size={20} />
              Grid
            </button>
            <button className={`btn join-item ${!isGridView ? "btn-active" : ""}`} onClick={() => setIsGridView(false)}>
              <List size={20} />
              List
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn m-1">
                <Filter size={20} />
                Filter
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a>All</a>
                </li>
                <li>
                  <a>Active</a>
                </li>
                <li>
                  <a>Pending</a>
                </li>
                <li>
                  <a>For Revision</a>
                </li>
              </ul>
            </div>

            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </div>

        <div
          className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
        >
          {filteredOrganizations.map((org) =>
            isGridView ? (
              <OrganizationCard key={org.id} organization={org} />
            ) : (
              <OrganizationListItem key={org.id} organization={org} />
            )
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

const OrganizationCard = ({ organization }) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="px-4 pt-4">
        <img src={organization.image} alt={organization.name} className="rounded-xl h-48 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{organization.name}</h2>
        <div className="flex items-center text-sm">
          <Bell size={16} className="mr-2" />
          <span
            className={`badge ${
              organization.status === "Active"
                ? "badge-primary"
                : organization.status === "Pending"
                ? "badge-ghost"
                : "badge-neutral"
            }`}
          >
            {organization.status}
          </span>
        </div>
      </div>
    </div>
  );
};

const OrganizationListItem = ({ organization }) => {
  return (
    <div className="card card-side bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="w-48">
        <img src={organization.image} alt={organization.name} className="h-full w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{organization.name}</h2>
        <div className="flex items-center">
          <Bell size={16} className="mr-2" />
          <span
            className={`badge ${
              organization.status === "Active"
                ? "badge-primary"
                : organization.status === "Pending"
                ? "badge-ghost"
                : "badge-neutral"
            }`}
          >
            {organization.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationsPage;
