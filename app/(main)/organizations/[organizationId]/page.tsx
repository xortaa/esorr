"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Printer, PlusCircle, CheckCircle, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useSession } from "next-auth/react";
import { pdf } from "@react-pdf/renderer";
import MyDocument from "@/components/AccredPDF";

type AnnexStatus = "Not Submitted" | "Rejected" | "For Review" | "Approved";

interface Annex {
  code: string;
  title: string;
  link: string;
  status: AnnexStatus;
}

interface Organization {
  _id: string;
  name: string;
}

interface SingleOrganization {
  name: string;
  logo?: string;
  isArchived: boolean;
  affiliation: string;
  officialEmail?: string;
  facebook?: string;
  isWithCentralOrganization?: boolean;
  isReligiousOrganization?: boolean;
  academicYearOfLastRecognition?: string;
  levelOfRecognition?: string;
  academicYear?: string;
  isInactive: boolean;
  status: "Incomplete" | "For Review" | "Complete";
  isAccredited: boolean;
}

export default function Component() {
  const [annexes, setAnnexes] = useState<Annex[]>([
    { code: "01", title: "Rules of Procedure for Recognition", link: "annex01", status: "Not Submitted" },
    { code: "02", title: "Petition for Recognition", link: "annex02", status: "Not Submitted" },
    { code: "A", title: "Student Organizations General Information Report", link: "annexA", status: "Not Submitted" },
    { code: "A-1", title: "Officer's Information Sheet", link: "annexA1", status: "Not Submitted" },
    { code: "B", title: "List of Members", link: "annexB", status: "Not Submitted" },
    { code: "C", title: "Certification of the Articles of Association", link: "annexC", status: "Not Submitted" },
    { code: "C-1", title: "Articles of Association", link: "annexC1", status: "Not Submitted" },
    { code: "D", title: "Organizations Logo and Letterhead", link: "annexD", status: "Not Submitted" },
    { code: "E", title: "Organization Operational Assessment Form", link: "annexE", status: "Not Submitted" },
    {
      code: "E-1",
      title: "Financial Report Summary of Receipts and Disbursements",
      link: "annexE1",
      status: "Not Submitted",
    },
    { code: "E-2", title: "Financial Report Liquidation Report", link: "annexE2", status: "Not Submitted" },
    {
      code: "E-3",
      title: "Performance Assessment of Student Organizations/Councils (PASOC) Form",
      link: "annexE3",
      status: "Not Submitted",
    },
    { code: "F", title: "Activities' Monitoring Form", link: "annexF", status: "Not Submitted" },
    { code: "G", title: "Organization Adviser Nomination Form", link: "annexG", status: "Not Submitted" },
    { code: "H", title: "Commitment to Anti-Hazing Law", link: "annexH", status: "Not Submitted" },
    { code: "I", title: "Commitment to Responsible Use of Social Media", link: "annexI", status: "Not Submitted" },
    { code: "J", title: "Commitment to Active Participation", link: "annexJ", status: "Not Submitted" },
    { code: "K", title: "Commitment to Care for the Environment", link: "annexK", status: "Not Submitted" },
    { code: "L", title: "Commitment to Submit The Post Event Evaluation", link: "annexL", status: "Not Submitted" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const currentYear = new Date().getFullYear();
  const [yearOfAccreditation, setYearOfAccreditation] = useState("");
  const [grade, setGrade] = useState("");
  const params = useParams();
  const organizationId = params.organizationId as string;
  const router = useRouter();
  const { data: session } = useSession();
  const currentPath = usePathname();
  const [organization, setOrganization] = useState<SingleOrganization>();
  const [accreditationCode, setAccreditationCode] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnexes = async () => {
      try {
        const response = await fetch(`/api/organizations/${organizationId}`);
        if (response.ok) {
          const data = await response.json();
          updateAnnexesStatus(data);
        } else {
          console.error("Failed to fetch organization data");
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations/fetch-organizations-no-populate");
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data);
        } else {
          console.error("Failed to fetch organizations");
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    const fetchOrganization = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/organizations/${organizationId}`);
        if (response.ok) {
          const data = await response.json();
          setOrganization(data);
        } else {
          console.error("Failed to fetch organization data");
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnexes();
    fetchOrganizations();
    fetchOrganization();
  }, [organizationId]);

  useEffect(() => {
    if (yearOfAccreditation && grade && organizations.length > 0) {
      const sortedOrganizations = [...organizations].sort((a, b) => a.name.localeCompare(b.name));
      const index = sortedOrganizations.findIndex((org) => org._id === organizationId);
      const paddedIndex = (index + 1).toString().padStart(2, "0");
      const newAccreditationCode = `RSO-${grade}-${yearOfAccreditation.slice(2, 4)}-${yearOfAccreditation.slice(
        7,
        9
      )}-${paddedIndex}`;
      setAccreditationCode(newAccreditationCode);
    }
  }, [organizations, organizationId, grade, yearOfAccreditation]);

  const updateAnnexesStatus = (organizationData: any) => {
    console.log("Received organization data:", organizationData);
    const updatedAnnexes = annexes.map((annex) => {
      const annexKey = annex.link;
      const annexData = organizationData[annexKey];
      console.log(`Processing ${annex.link}:`, annexData);
      if (annexData && annexData.length > 0) {
        const latestAnnex = annexData[annexData.length - 1];
        console.log(`Latest ${annex.link} status:`, latestAnnex.status);
        return { ...annex, status: latestAnnex.status as AnnexStatus };
      }
      return annex;
    });
    console.log("Updated annexes:", updatedAnnexes);
    setAnnexes(updatedAnnexes);
  };

  const completedAnnexes = annexes.filter((annex) => annex.status === "Approved").length;
  const progress = (completedAnnexes / annexes.length) * 100;

  const nextAcademicYear = `${currentYear + 1}-${currentYear + 2}`;

  const handleCreateNewAcademicYear = async () => {
    try {
      const response = await fetch(`/api/${organizationId}/new-academic-year`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentAcademicYear: nextAcademicYear }),
      });

      if (response.ok) {
        console.log("New academic year created successfully");
        setIsModalOpen(false);
        // You might want to refresh the page or update the state here
      } else {
        console.error("Failed to create new academic year");
      }
    } catch (error) {
      console.error("Error creating new academic year:", error);
    }
  };

  const handleSubmitAccreditation = async () => {
    try {
      const fullYearOfAccreditation = `${yearOfAccreditation.split("-")[0]}-${yearOfAccreditation.split("-")[1]}`;
      const response = await fetch(`/api/organizations/${organizationId}/add-accreditation`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accreditationCode,
          yearOfAccreditation: fullYearOfAccreditation,
        }),
      });

      if (response.ok) {
        alert("Accreditation updated successfully");
        // Refresh the page
        window.location.reload();
      } else {
        alert("Failed to update accreditation");
      }
    } catch (error) {
      console.error("Error updating accreditation:", error);
      alert("An error occurred while updating accreditation");
    }
  };

  const generatePDFBlob = async (organization) => {
    try {
      console.log("Generating PDF...", organization);
      const blob = await pdf(<MyDocument organization={organization} />).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const generatePDF = async (organization) => {
    setIsGeneratingPDF(true);
    try {
      const blob = await generatePDFBlob(organization);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <PageWrapper>
      <BackButton />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Annexes Dashboard</h1>
        <div>
          {session?.user?.role === "RSO" && (
            <button className="btn btn-outline mr-2" onClick={() => setIsModalOpen(true)}>
              Create New Academic Year ({nextAcademicYear})
            </button>
          )}
        </div>
      </div>
      {session?.user?.role === "OSA" ||
        session?.user?.role === "SOCC" ||
        (session?.user?.role === "RSO" && (
          <Link href={`${currentPath}/profile`} className="btn btn-outline btn-sm">
            Organization Profile
          </Link>
        ))}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg">Create New Academic Year</h3>
            <p className="py-4">
              Are you sure you want to create a new academic year for {nextAcademicYear}? This action is irreversible.
            </p>
            <div className="modal-action">
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateNewAcademicYear}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {session?.user?.role === "OSA" && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-start gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Year of Accreditation</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={yearOfAccreditation}
                onChange={(e) => setYearOfAccreditation(e.target.value)}
              >
                <option value="">Select year</option>
                {[...Array(5)].map((_, i) => {
                  const year = currentYear + i;
                  const nextYear = year + 1;
                  const academicYear = `${year}-${nextYear}`;
                  return (
                    <option key={academicYear} value={academicYear}>
                      {academicYear.slice(2, 4)}-{nextYear.toString().slice(-2)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Grade</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="">Select grade</option>
                {["A", "B", "C", "D"].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Accreditation Code</span>
              </label>
              <input
                type="text"
                placeholder="Accreditation Code"
                className="input input-bordered w-full max-w-xs"
                value={organization?.levelOfRecognition || accreditationCode}
                disabled
              />
            </div>
          </div>
          <button className="btn btn-primary mt-4 max-w-xs" onClick={handleSubmitAccreditation}>
            Submit Accreditation
          </button>
        </div>
      )}

      <p className="text-slate-500 mb-4">
        Welcome to the Annexes Dashboard! Here you can find all the annexes that you need to submit for your
        organization's recognition.
      </p>

      {isLoading ? (
        <div className="w-full flex justify-center items-center py-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : organization ? (
        organization.academicYearOfLastRecognition === organization.academicYear ? (
          <button
            className="btn btn-primary w-full"
            onClick={() => generatePDF(organization)}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <span className="loading loading-spinner"></span>
                Generating Certificate...
              </>
            ) : (
              "Download Certificate of Recognition"
            )}
          </button>
        ) : (
          <p className="text-center py-4">
            Certificate not available for the current academic year. All annexes need to be approved
          </p>
        )
      ) : (
        <p className="text-center py-4">Failed to load organization data. Please try again later.</p>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Overall Progress</h2>
          <span className="text-lg font-medium">
            {completedAnnexes} / {annexes.length} completed
          </span>
        </div>
        <div
          className="w-full bg-gray-200 rounded-full h-2.5
dark:bg-gray-700"
        >
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="border bg-slate-100 mb-4 p-4 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Annexes</h2>
        </div>

        <div>
          {annexes.map((annex) => (
            <AnnexDashboardAnnexCard key={annex.code} annex={annex} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

interface AnnexDashboardAnnexCardProps {
  annex: Annex;
}

const AnnexDashboardAnnexCard = ({ annex }: AnnexDashboardAnnexCardProps) => {
  const currentPath = usePathname();

  const getStatusColor = (status: AnnexStatus) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "For Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: AnnexStatus) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={20} className="text-green-500" />;
      case "For Review":
        return <Clock size={20} className="text-yellow-500" />;
      case "Rejected":
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <PlusCircle size={20} className="text-gray-500" />;
    }
  };

  return (
    <Link
      href={`${currentPath}/${annex.link}`}
      className={`flex justify-between items-center p-4 mb-2 rounded-lg border ${getStatusColor(
        annex.status
      )} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-center gap-4">
        <span className="text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-white">
          {annex.code}
        </span>
        <div>
          <p className="text-lg font-medium">{annex.title}</p>
          <p className="text-sm text-slate-600">{annex.status}</p>
        </div>
      </div>
      <div className="flex items-center">{getStatusIcon(annex.status)}</div>
    </Link>
  );
};
