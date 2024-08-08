"use client";
import { useEffect, useState } from "react";

import OrganizationCard from "@/components/OrganizationCard";
import PageContentWrapper from "@/components/PageContentWrapper";
import { Organization } from "@/types";
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";

const DashboardPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    axios.get("/api/organizations").then((res) => {
      setOrganizations(res.data);
    });
  }, []);

  return (
    <PageContentWrapper>
      {!organizations.length ? (
        <LoadingSpinner />
      ) : (
        <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 sm:grid-cols-1 gap-8">
          {organizations.map((org) => (
            <OrganizationCard key={org._id} image={org.image} name={org.name} status={org.status} />
          ))}
        </div>
      )}
    </PageContentWrapper>
  );
};
export default DashboardPage;
