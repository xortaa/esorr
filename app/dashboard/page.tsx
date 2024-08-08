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
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4 auto-rows-fr">
          {organizations.map((org) => (
            <OrganizationCard key={org._id} image={org.image} name={org.name} status={org.status} />
          ))}
        </div>
      )}
    </PageContentWrapper>
  );
};
export default DashboardPage;