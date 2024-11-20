"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [selectedAffiliation, setSelectedAffiliation] = useState("");
  const [affiliationType, setAffiliationType] = useState("All");
  const [affiliationSearchTerm, setAffiliationSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      setIsSessionLoading(true);
      return;
    }

    setIsSessionLoading(false);

    if (status === "authenticated" && session?.user?.role) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [orgsResponse, affiliationsResponse] = await Promise.all([
            axios.get("/api/organizations"),
            axios.get("/api/affiliations"),
          ]);
          setOrganizations(orgsResponse.data);
          setAffiliations(affiliationsResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [status, session]);

  const filteredAffiliations = affiliations.filter((affiliation) =>
    affiliation.name.toLowerCase().includes(affiliationSearchTerm.toLowerCase())
  );

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (affiliationType === "All" ||
        (affiliationType === "University Wide" && org.affiliation === "University Wide") ||
        (affiliationType === "Other" &&
          org.affiliation !== "University Wide" &&
          (selectedAffiliation === "" || org.affiliation === selectedAffiliation)))
  );

  if (isSessionLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </PageWrapper>
    );
  }

  if (status === "unauthenticated") {
    return (
      <PageWrapper>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please sign in to view organizations.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Organizations</h1>
        <p className="text-lg text-gray-600 mt-2">Browse all student organizations</p>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between mb-8 gap-6">
        <div className="form-control w-full lg:w-1/3">
          <label className="label">
            <span className="label-text">Search organizations</span>
          </label>
          <label className="input-group">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-2/3">
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Filter by type</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", "University Wide", "Other"].map((type) => (
                <label key={type} className="label cursor-pointer">
                  <input
                    type="radio"
                    name="affiliation-type"
                    className="radio radio-primary mr-2"
                    checked={affiliationType === type}
                    onChange={() => setAffiliationType(type)}
                  />
                  <span className="label-text">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {affiliationType === "Other" && (
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Select affiliation</span>
              </label>
              <div className="dropdown w-full">
                <label tabIndex={0} className="btn btn-outline w-full justify-between">
                  {selectedAffiliation || "Select affiliation"}
                  <ChevronDown size={20} />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-[1]"
                >
                  <li className="menu-title">
                    <span>Affiliations</span>
                  </li>
                  <li>
                    <input
                      type="text"
                      placeholder="Search affiliations"
                      className="input input-bordered w-full"
                      value={affiliationSearchTerm}
                      onChange={(e) => setAffiliationSearchTerm(e.target.value)}
                    />
                  </li>
                  {filteredAffiliations.map((affiliation) => (
                    <li key={affiliation._id}>
                      <a onClick={() => setSelectedAffiliation(affiliation.name)}>{affiliation.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredOrganizations.map((org) => (
            <OrganizationCard key={org._id} organization={org} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

function OrganizationCard({ organization }) {
  const router = useRouter();
  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      onClick={() => router.push(`/organizations/${organization._id}`)}
    >
      <figure className="px-4 pt-4">
        <img src={organization.logo} alt={organization.name} className="rounded-xl h-48 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{organization.name}</h2>
        <p className="text-sm text-gray-600">{organization.affiliation}</p>
        <div className="flex items-center text-sm">
          <span
            className={`badge ${
              organization.status === "Active"
                ? "badge-primary"
                : organization.status === "Incomplete"
                ? "badge-ghost"
                : organization.status === "Inactive"
                ? "badge-error"
                : "badge-neutral"
            }`}
          >
            {organization.status}
          </span>
        </div>
      </div>
    </div>
  );
}
