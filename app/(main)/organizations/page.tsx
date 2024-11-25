// "use client";

// import { useState, useEffect } from "react";
// import { Search, ChevronDown, RefreshCw } from "lucide-react";
// import PageWrapper from "@/components/PageWrapper";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import MyDocument from "@/components/ResoPDF";
// import { pdf } from "@react-pdf/renderer";
// import dynamic from "next/dynamic";


// const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
//   ssr: false,
//   loading: () => <p>Loading PDF viewer...</p>,
// });

// export default function OrganizationsPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [organizations, setOrganizations] = useState([]);
//   const [affiliations, setAffiliations] = useState([]);
//   const [selectedAffiliation, setSelectedAffiliation] = useState("");
//   const [affiliationType, setAffiliationType] = useState("All");
//   const [affiliationSearchTerm, setAffiliationSearchTerm] = useState("");
//   const [submissionsStatus, setSubmissionsStatus] = useState({ submissionAllowed: true });

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const fetchData = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const [orgsResponse, affiliationsResponse, submissionStatusResponse] = await Promise.all([
//         axios.get("/api/organizations"),
//         axios.get("/api/affiliations"),
//         axios.get("/api/organizations/fetch-submission-status"),
//       ]);
//       setOrganizations(orgsResponse.data);
//       setAffiliations(affiliationsResponse.data);
//       setSubmissionsStatus(submissionStatusResponse.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to fetch data. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.role) {
//       fetchData();
//     }
//   }, [status, session]);

//   const filteredAffiliations = affiliations.filter((affiliation) =>
//     affiliation.name.toLowerCase().includes(affiliationSearchTerm.toLowerCase())
//   );

//   const filteredOrganizations = organizations.filter(
//     (org) =>
//       org.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (affiliationType === "All" ||
//         (affiliationType === "University Wide" && org.affiliation === "University Wide") ||
//         (affiliationType === "Other" &&
//           org.affiliation !== "University Wide" &&
//           (selectedAffiliation === "" || org.affiliation === selectedAffiliation)))
//   );

//   const toggleSubmission = async () => {
//     axios.post("/api/organizations/toggle-submissions").then(() => {
//       const isAllowed = submissionsStatus.submissionAllowed;
//       setSubmissionsStatus({ submissionAllowed: !isAllowed });
//     });
//   };

//   if (status === "loading") {
//     return (
//       <PageWrapper>
//         <div className="flex justify-center items-center h-screen">
//           <span className="loading loading-spinner loading-lg"></span>
//         </div>
//       </PageWrapper>
//     );
//   }

//   if (status === "unauthenticated") {
//     return (
//       <PageWrapper>
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
//           <p>Please sign in to view organizations.</p>
//           <Link href="/" className="btn btn-neutral">
//             Back to Sign In Page
//           </Link>
//         </div>
//       </PageWrapper>
//     );
//   }

//   const generatePDFBlob = async (organizations) => {
//     try {
//       console.log("Generating PDF...", organizations);
//       const blob = await pdf(<MyDocument organizations={organizations} />).toBlob();
//       return blob;
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       throw error;
//     }
//   };

//   const generatePDF = async (organizations) => {
//     try {
//       const blob = await generatePDFBlob(organizations);
//       const url = URL.createObjectURL(blob);
//       window.open(url, "_blank");
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       setError("Failed to generate PDF. Please try again.");
//     }
//   };

//   return (
//     <PageWrapper>
//       <div className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-4xl font-bold text-primary">Organizations</h1>
//           <p className="text-lg text-gray-600 mt-2">Browse all student organizations</p>
//         </div>
//         <button onClick={fetchData} className="btn btn-ghost btn-circle" aria-label="Refresh organizations">
//           <RefreshCw size={20} />
//         </button>
//       </div>

//       {session.user.role === "OSA" && !isLoading && (
//         <div className="flex items-center justify-start gap-2">
//           <button onClick={toggleSubmission} className="btn btn-primary" aria-label="Toggle submissions">
//             {submissionsStatus.submissionAllowed ? "Disable" : "Enable"} Submissions
//           </button>
//           <button className="btn btn-outline" onClick={() => generatePDF(organizations)}>
//             Download List of Accredited Organizations
//           </button>
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row items-start justify-between mb-8 gap-6">
//         <div className="form-control w-full lg:w-1/3">
//           <label className="label">
//             <span className="label-text">Search organizations</span>
//           </label>
//           <label className="input-group">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="input input-bordered w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </label>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-2/3">
//           <div className="form-control flex-1">
//             <label className="label">
//               <span className="label-text">Filter by type</span>
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {["All", "University Wide", "Other"].map((type) => (
//                 <label key={type} className="label cursor-pointer">
//                   <input
//                     type="radio"
//                     name="affiliation-type"
//                     className="radio radio-primary mr-2"
//                     checked={affiliationType === type}
//                     onChange={() => setAffiliationType(type)}
//                   />
//                   <span className="label-text">{type}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {affiliationType === "Other" && (
//             <div className="form-control flex-1">
//               <label className="label">
//                 <span className="label-text">Select affiliation</span>
//               </label>
//               <div className="dropdown w-full">
//                 <label tabIndex={0} className="btn btn-outline w-full justify-between">
//                   {selectedAffiliation || "Select affiliation"}
//                   <ChevronDown size={20} />
//                 </label>
//                 <ul
//                   tabIndex={0}
//                   className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-[1]"
//                 >
//                   <li className="menu-title">
//                     <span>Affiliations</span>
//                   </li>
//                   <li>
//                     <input
//                       type="text"
//                       placeholder="Search affiliations"
//                       className="input input-bordered w-full"
//                       value={affiliationSearchTerm}
//                       onChange={(e) => setAffiliationSearchTerm(e.target.value)}
//                     />
//                   </li>
//                   {filteredAffiliations.map((affiliation) => (
//                     <li key={affiliation._id}>
//                       <a onClick={() => setSelectedAffiliation(affiliation.name)}>{affiliation.name}</a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="alert alert-error mb-4">
//           <p>{error}</p>
//         </div>
//       )}

//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <span className="loading loading-spinner loading-lg"></span>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
//           {filteredOrganizations.map((org) => (
//             <OrganizationCard key={org._id} organization={org} />
//           ))}
//         </div>
//       )}
//     </PageWrapper>
//   );
// }

// function OrganizationCard({ organization }) {
//   const router = useRouter();
//   return (
//     <div
//       className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//       onClick={() => router.push(`/organizations/${organization._id}`)}
//     >
//       <figure className="px-4 pt-4">
//         <img
//           src={organization.logo || "/placeholder.svg?height=192&width=256"}
//           alt={organization.name}
//           className="rounded-xl h-48 w-full object-cover"
//         />
//       </figure>
//       <div className="card-body">
//         <h2 className="card-title text-lg">{organization.name}</h2>
//         <p className="text-sm text-gray-600">{organization.affiliation}</p>
//         <div className="flex items-center text-sm">
//           <span
//             className={`badge ${
//               organization.calculatedStatus === "Completed"
//                 ? "badge-primary"
//                 : organization.calculatedStatus === "Incomplete"
//                 ? "badge-ghost"
//                 : organization.calculatedStatus === "For Review"
//                 ? "badge-warning"
//                 : "badge-neutral"
//             }`}
//           >
//             {organization.calculatedStatus}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page