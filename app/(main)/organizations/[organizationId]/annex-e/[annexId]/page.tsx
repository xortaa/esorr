"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";

interface Event {
  _id: string;
  title: string;
  eReserveNumber?: string;
  date?: string;
  venue?: string;
  adviser?: string;
  timeAttended?: { from: string; to: string };
  speakerName?: string;
  speakerTopic?: string;
  speakerAffiliation?: string;
  speakerPosition?: string;
  totalParticipants?: number;
  totalRespondents?: number;
  evaluationSummary?: {
    [key: string]: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  assessment?: {
    criteria: {
      [key: string]: {
        rating: number;
        analysis: string;
        recommendation: string;
      };
    };
    comments: { id: string; text: string }[];
    sponsorName: string;
    sponsorshipTypes: string[];
  };
}

interface Category {
  id: string;
  title: string;
  description?: string;
}

interface OperationalAssessment {
  _id: string;
  v01: { event: Event }[];
  v02: { event: Event }[];
  v03: { event: Event }[];
  v04: { event: Event }[];
  v05: { event: Event }[];
  v06: { event: Event }[];
  v07: { event: Event }[];
  v08: { event: Event }[];
  v09: { event: Event }[];
  s1: { event: Event }[];
  s2: { event: Event }[];
  s3: { event: Event }[];
  e1: { event: Event }[];
  e2: { event: Event }[];
  e3: { event: Event }[];
  a1: { event: Event }[];
  a2: { event: Event }[];
  a3: { event: Event }[];
  l1: { event: Event }[];
  l2: { event: Event }[];
  l3: { event: Event }[];
  sdg1: { event: Event }[];
  sdg2: { event: Event }[];
  sdg3: { event: Event }[];
  sdg4: { event: Event }[];
  sdg5: { event: Event }[];
  sdg6: { event: Event }[];
  sdg7: { event: Event }[];
  sdg8: { event: Event }[];
  sdg9: { event: Event }[];
  sdg10: { event: Event }[];
  sdg11: { event: Event }[];
  sdg12: { event: Event }[];
  sdg13: { event: Event }[];
  sdg14: { event: Event }[];
  sdg15: { event: Event }[];
  sdg16: { event: Event }[];
  sdg17: { event: Event }[];
}

const OrganizationOperationalAssessmentForm = () => {
  const currentPath = usePathname();
  const { organizationId, annexId } = useParams();
  const [operationalAssessment, setOperationalAssessment] = useState<OperationalAssessment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    eReserveNo: "",
    categories: [] as string[],
  });

  const strategicAreas: Category[] = [
    {
      id: "v01",
      title: "Thomasian Identity",
      description:
        "To form servant leaders who espouse Thomasian ideals and values as they collaborate with the University in the fulfillment of her mission and actively take part in nation building.",
    },
    {
      id: "v02",
      title: "Leadership and Governance",
      description:
        "To fully actualize a proactive, systematic, and mission-oriented University leadership and governance in order to be recognized as a premiere institution of Learning in Asia.",
    },
    {
      id: "v03",
      title: "Teaching and Learning",
      description: "To be a world-class institution of higher learning.",
    },
    {
      id: "v04",
      title: "Research and Innovation",
      description:
        "To become an internationally acknowledged expert in pioneering and innovative research in the arts and humanities, social science, business management and education, health and allied sciences, science and technology, and the sacred sciences.",
    },
    {
      id: "v05",
      title: "Community Development and Advocacy",
      description:
        "To become a vibrant community of evangelizers actively engaged in social transformation through advocacy and ministry.",
    },
    {
      id: "v06",
      title: "Student Welfare and Services",
      description:
        "To promote and ensure student academic achievement and life success through responsive and empirical-based services of global standards.",
    },
    {
      id: "v07",
      title: "Public Presence",
      description:
        "To be an institution of preeminent influence in the global community by taking a proactive stance in social, cultural, and moral advocacies and assuming a lead role in national and international policy formulation.",
    },
    {
      id: "v08",
      title: "Resource Management",
      description:
        "To provide a conducive learning and working environment with state-of-the-art facilities and resources in a self-sustainable University through the engagement of a professional Thomasian workforce who meets international standards and adapts to global change.",
    },
    {
      id: "v09",
      title: "Internationalization",
      description:
        "To promote internationalization and integrate it into the institution's strategic plans and initiatives for the purpose of preparing students for a productive engagement in the global arena of ideas and work.",
    },
  ];

  const sealIndicators: { category: string; indicators: string[] }[] = [
    {
      category: "Servant Leader",
      indicators: [
        "S1: Show leadership abilities to promote advocacies for life, freedom, justice, and solidarity in the service of the family, the local and global communities, the Church and the environment.",
        "S2: Implement relevant projects and activities that speak of Christian compassion to the poor and the marginalized in order to raise their quality of life.",
        "S3: Show respect for the human person, regardless of race, religion, age, and gender.",
      ],
    },
    {
      category: "Effective communicator and collaborator",
      indicators: [
        "E1: Express myself clearly, correctly, and confidently in various environments, contexts, and technologies of human interaction.",
        "E2: Work productively with individuals or groups from diverse cultures and demographics.",
        "E3: Show profound respect for individual differences and/or uniqueness as members of God's creation.",
      ],
    },
    {
      category: "Analytical and creative thinker",
      indicators: [
        "A1: Show judiciousness and resourcefulness in making personal and professional decisions.",
        "A2: Engage in research undertakings that respond to societal issues.",
        "A3: Express personal and professional insights through an ethical and evidence-based approach.",
      ],
    },
    {
      category: "Lifelong learner",
      indicators: [
        "L1: Engage in reflective practice to ensure disciplinal relevance and professional development.",
        "L2: Exhibit preparedness and interest for continuous upgrading of competencies required by the profession or area of specialization.",
        "L3: Manifest fidelity to the teachings of Christ, mediated by the Catholic Church, in the continuous deepening of faith and spirituality in dealing with new life situations and challenges.",
      ],
    },
  ];

  const projectDirections: string[] = [
    "SDG 1 END POVERTY",
    "SDG 2 END HUNGER",
    "SDG 3 WELL-BEING",
    "SDG 4 QUALITY EDUCATION",
    "SDG 5 GENDER EQUALITY",
    "SDG 6 WATER AND SANITATION FOR ALL",
    "SDG 7 AFFORDABLE AND SUSTAINABLE ENERGY",
    "SDG 8 DECENT WORK FOR ALL",
    "SDG 9 TECHNOLOGY TO BENEFIT ALL",
    "SDG 10 REDUCE INEQUALITY",
    "SDG 11 SAFE CITIES AND COMMUNITIES",
    "SDG 12 RESPONSIBLE CONSUMPTION BY ALL",
    "SDG 13 STOP CLIMATE CHANGE",
    "SDG 14 PROTECT THE OCEAN",
    "SDG 15 TAKE CARE OF THE EARTH",
    "SDG 16 LIVE IN PEACE",
    "SDG 17 MECHANISMS AND PARTNERSHIPS TO REACH THE GOAL",
  ];

  const allCategories: Category[] = [
    ...strategicAreas,
    ...sealIndicators.flatMap((category, index) =>
      category.indicators.map((indicator, i) => ({
        id: `${category.category.charAt(0).toLowerCase()}${i + 1}`,
        title: `${category.category} - ${indicator.split(":")[0]}`,
        description: indicator.split(":")[1].trim(),
      }))
    ),
    ...projectDirections.map((direction, index) => ({
      id: `sdg${index + 1}`,
      title: direction,
    })),
  ];

  useEffect(() => {
    fetchOperationalAssessment();
  }, []);

  const fetchOperationalAssessment = async () => {
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-e/${annexId}/operational-assessment`);
      if (response.data && response.data._id) {
        setOperationalAssessment(response.data);
      } else {
        console.error("Operational assessment data is missing or invalid");
      }
    } catch (error) {
      console.error("Error fetching operational assessment:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewEvent({ title: "", eReserveNo: "", categories: [] });
  };

  const toggleCategory = (categoryId: string) => {
    setNewEvent((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const submitEvent = async () => {
    if (newEvent.title && newEvent.eReserveNo && newEvent.categories.length > 0 && operationalAssessment) {
      try {
        const response = await axios.post(
          `/api/annexes/${organizationId}/annex-e/${annexId}/operational-assessment/${operationalAssessment._id}/event`,
          {
            title: newEvent.title,
            eReserveNumber: newEvent.eReserveNo,
            categories: newEvent.categories,
          }
        );
        console.log({ title: newEvent.title, eReserveNumber: newEvent.eReserveNo, categories: newEvent.categories });

        if (response.status === 201) {
          await fetchOperationalAssessment();
          closeModal();
        } else {
          throw new Error("Failed to create event");
        }
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
  };

  const removeEvent = async (eventId: string, category: string) => {
    if (operationalAssessment) {
      try {
        const response = await axios.delete(
          `/api/annexes/${organizationId}/annex-e/${annexId}/operational-assessment/${operationalAssessment._id}/event/${eventId}`,
          { params: { category } }
        );

        if (response.status === 200) {
          await fetchOperationalAssessment();
        } else {
          throw new Error("Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const getEventsForCategory = (categoryId: string) => {
    if (!operationalAssessment) return [];
    const category = operationalAssessment[categoryId as keyof OperationalAssessment];
    if (Array.isArray(category)) {
      return category.map((item) => item.event);
    }
    return [];
  };

  const renderEventList = (categoryId: string) => (
    <>
      {getEventsForCategory(categoryId).map((event: Event) => (
        <div key={event._id} className="my-2">
          <Link href={`${currentPath}/${event._id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
            {event.title} {event.eReserveNumber && `(e-ReSERVe No: ${event.eReserveNumber})`}
          </Link>
          <button className="btn btn-ghost btn-xs ml-2" onClick={() => removeEvent(event._id, categoryId)}>
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </>
  );

  const isSubmitDisabled = !newEvent.title || !newEvent.eReserveNo || newEvent.categories.length === 0;

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4 text-center">Organization Operational Assessment Form</h1>
      <p className="mb-4 text-sm">
        Align all event/projects hosted by the organization to the Strategic Directional Areas, SEAL of Thomasian
        Education, and Project Direction.
        <br />
        (Include event title and e-ReSERVe No. in all segments applicable)
      </p>
      <button className="btn btn-primary mb-4" onClick={openModal}>
        <Plus size={16} className="mr-2" /> Add New Event
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Event</h2>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event title"
            />
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              value={newEvent.eReserveNo}
              onChange={(e) => setNewEvent({ ...newEvent, eReserveNo: e.target.value })}
              placeholder="e-ReSERVe No."
            />
            <div className="mb-4">
              <h3 className="font-bold mb-2">Select Categories:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allCategories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={newEvent.categories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    <span>{category.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={submitEvent} disabled={isSubmitDisabled}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th className="w-1/3">STRATEGIC DIRECTIONAL AREAS (SDAs) SUPPORTED BY THE PROJECT OUTCOMES</th>
              <th className="w-2/3">TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE SDAs</th>
            </tr>
          </thead>
          <tbody>
            {strategicAreas.map((area) => (
              <tr key={area.id}>
                <td className="font-bold">{area.id.toUpperCase()}</td>
                <td>
                  <span className="font-bold">{area.title}. </span>
                  {area.description}
                </td>
                <td>{renderEventList(area.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-1/4">SEAL OF THOMASIAN EDUCATION</th>
              <th className="w-1/3">
                SEAL OF THOMASIAN EDUCATION <br /> PERFORMANCE INDICATORS (SEAL-PI)
              </th>
              <th className="w-5/12">TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE SEAL-PI</th>
            </tr>
          </thead>
          <tbody>
            {sealIndicators.map((category, index) =>
              category.indicators.map((indicator, i) => (
                <tr key={`${index}-${i}`}>
                  {i === 0 && (
                    <td rowSpan={category.indicators.length} className="align-top font-bold">
                      {category.category}
                    </td>
                  )}
                  <td>{indicator}</td>
                  <td>{renderEventList(`${category.category.charAt(0).toLowerCase()}${i + 1}`)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-1/3">PROJECT DIRECTION</th>
              <th className="w-2/3">TITLE OF EVENTS WITH e-ReSERVe NO. SUPPORTING THE PROJECT DIRECTION</th>
            </tr>
          </thead>
          <tbody>
            {projectDirections.map((direction, index) => (
              <tr key={index}>
                <td>{direction}</td>
                <td>{renderEventList(`sdg${index + 1}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
};

export default OrganizationOperationalAssessmentForm;
