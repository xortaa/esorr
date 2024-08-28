import OrganizationCard from "@/components/OrganizationCard";
import { Search, Filter, LayoutGrid, Rows3 } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const OrganizationsPage = () => {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <p className="text-slate-500 text-sm">Browse all student organizations</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <button className="btn btn-ghost">
            <p>Grid View</p>
            <LayoutGrid />
          </button>
          <button className="btn btn-ghost">
            <p>List View</p>
            <Rows3 />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 mb-4">
          <button className="btn btn-ghost">
            <Filter />
            Filter
          </button>
          <label className="input input-primary input-bordered border-primary flex items-center gap-2">
            <Search />
            <input type="text" className="grow" placeholder="Search..." />
          </label>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
        <OrganizationCard />
      </div>
    </PageWrapper>
  );
};
export default OrganizationsPage;
