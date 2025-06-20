"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import {
  Plus,
  Receipt,
  Calendar,
  Hash,
  Layers,
  FileText,
  Building2,
  Users,
  ShoppingBag,
  X,
  CalendarDays,
  PhilippinePeso,
} from "lucide-react";
import axios from "axios";
import { uploadImage } from "@/utils/storage";
import { parseISO, isValid, format } from "date-fns";
import BackButton from "@/components/BackButton";
import formatMoney from "@/utils/formatMoney";

interface Event {
  _id: string;
  title: string;
  eReserveNumber: string;
}

interface OutflowItem {
  _id: string;
  category: string;
  description: string;
  cost: number;
  quantity: number;
  serialNumber: string;
  expenseReportCategory: string;
}

interface Outflow {
  _id: string;
  establishment: string;
  date: string;
  items: OutflowItem[];
  image: string;
  totalCost: number;
  event: string;
}

interface Inflow {
  _id: string;
  category: string;
  date: string;
  amount: number;
  payingParticipants?: number;
  totalMembers?: number;
  merchandiseSales?: number;
}

const outflowCategories = [
  "I. Food Expense",
  "II. Transportation",
  "III. Office Supplies",
  "IV. Physical Arrangement",
  "V. Documentation",
  "VI. Promotions",
  "VII. Professional Fee/ Honoraria/ Token",
  "VIII. Awards and Prizes",
  "IX. Publication",
  "X. Rentals",
  "XI. Equipment",
  "XII. Costumes",
  "XIII. Membership Kits",
  "XIV. Registration Fees",
  "XV. Cash Donations or Sponsorship to Other Organizations",
  "XVI. Miscellaneous Expense",
];

const inflowCategories = [
  "Organization Fund / Beginning Balance",
  "Membership Fee",
  "Registration Fee",
  "Merchandise Selling",
  "Subsidy: Student Activity Fund (For LSC & CBO Only)",
  "Subsidy: Community Service Fund",
  "Subsidy: University-Wide Student Organization Fund (For USO Only)",
  "Subsidy: CSC/SOCC Fund (For CSC & SOCC Only)",
  "Subsidy: Local Student Council Fund (For LSC Only)",
  "Cash Sponsorships",
  "Interest Income",
];

const expenseReportCategories = ["Meals", "Transport", "Supplies", "Lodging", "Repairs", "Others", "Misc."];

const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  if (isValid(date)) {
    return format(date, "yyyy-MM-dd");
  }
  return "Invalid Date";
};

export default function AnnexE2FinancialLiquidationReport() {
  const params = useParams();
  const organizationId = params.organizationId as string;
  const annexId = params.annexId as string;
  const operationalAssessmentId = params.operationalAssessmentId as string;
  const [activeTab, setActiveTab] = useState<"outflow" | "inflow">("outflow");
  const [outflows, setOutflows] = useState<Outflow[]>([]);
  const [currentOutflow, setCurrentOutflow] = useState<Outflow | null>(null);
  const [inflows, setInflows] = useState<Inflow[]>([]);
  const [currentInflow, setCurrentInflow] = useState<Inflow>({
    _id: "",
    category: "",
    date: "",
    amount: 0,
    payingParticipants: 0,
    totalMembers: 0,
    merchandiseSales: 0,
  });
  const [isEditingInflow, setIsEditingInflow] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<OutflowItem>({
    _id: "",
    category: "",
    description: "",
    cost: 0,
    quantity: 1,
    serialNumber: "",
    expenseReportCategory: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<OutflowItem | null>(null);
  const [localOutflow, setLocalOutflow] = useState<Outflow | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const isReceiptSaveDisabled =
    !currentOutflow?.establishment || !currentOutflow?.date || currentOutflow?.items.length === 0;

  useEffect(() => {
    fetchOutflows();
    fetchInflows();
    fetchEvents();
    fetchAcademicYear();
  }, []);

  useEffect(() => {
    if (academicYear) {
      const [startYear, endYear] = academicYear.split("-").map(Number);
      const start = new Date(startYear, 7, 1); // August 1st of the start year
      const end = new Date(endYear, 6, 31); // July 31st of the end year

      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [academicYear]);

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const eventResponse = await axios.get(`/api/organizations/${organizationId}/get-events-for-academic-year`);
      setEvents(eventResponse.data);
      console.log("Events:", eventResponse.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchAcademicYear = async () => {
    try {
      const response = await axios.get(`/api/${organizationId}/get-current-academic-year`);
      setAcademicYear(response.data.academicYear);
    } catch (error) {
      console.error("Error fetching academic year:", error);
    }
  };

  const fetchOutflows = async () => {
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-e2/${annexId}/outflow`);
      setOutflows(response.data);
    } catch (error) {
      console.error("Error fetching outflows:", error);
    }
  };

  const fetchInflows = async () => {
    try {
      const response = await axios.get(`/api/annexes/${organizationId}/annex-e2/${annexId}/inflow`);
      setInflows(
        response.data.map((inflow: Inflow) => ({
          ...inflow,
          date: formatDate(inflow.date),
        }))
      );
    } catch (error) {
      console.error("Error fetching inflows:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCurrentOutflow({
        _id: "",
        establishment: "",
        date: "",
        items: [],
        image: "",
        totalCost: 0,
        event: "",
      });
    }
  };

  const handleOutflowDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (localOutflow) {
      setLocalOutflow({ ...localOutflow, [name]: value });
    }
    if (currentOutflow) {
      setCurrentOutflow({ ...currentOutflow, [name]: value });
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingItem && currentOutflow) {
      const updatedItem = { ...editingItem, [name]: name === "cost" || name === "quantity" ? Number(value) : value };
      setEditingItem(updatedItem);
      const updatedItems = currentOutflow.items.map((item) => (item._id === editingItem._id ? updatedItem : item));
      setCurrentOutflow({ ...currentOutflow, items: updatedItems });
    } else {
      setNewItem({ ...newItem, [name]: name === "cost" || name === "quantity" ? Number(value) : value });
    }
  };

  const addItem = () => {
    if (currentOutflow) {
      const updatedOutflow = {
        ...currentOutflow,
        items: [...currentOutflow.items, { ...newItem, _id: Date.now().toString() }],
      };
      setCurrentOutflow(updatedOutflow);
      setNewItem({
        _id: "",
        category: "",
        description: "",
        cost: 0,
        quantity: 1,
        serialNumber: "",
        expenseReportCategory: "",
      });
      setIsAddingItem(false);
    }
  };

  const updateItem = () => {
    if (currentOutflow && editingItem) {
      const updatedItems = currentOutflow.items.map((item) => (item._id === editingItem._id ? editingItem : item));
      setCurrentOutflow({ ...currentOutflow, items: updatedItems });
      setEditingItem(null);
    }
  };

  const deleteItem = (itemId: string) => {
    if (localOutflow) {
      const updatedItems = localOutflow.items.filter((item) => item._id !== itemId);
      setLocalOutflow({ ...localOutflow, items: updatedItems });
    }
  };

  const createOutflow = async () => {
    if (currentOutflow) {
      setIsLoading(true);
      try {
        const totalCost = currentOutflow.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
        const outflowData = {
          establishment: currentOutflow.establishment,
          date: currentOutflow.date,
          totalCost,
          image: currentOutflow.image,
          items: currentOutflow.items.map(({ _id, ...item }) => item),
        };
        const response = await axios.post(`/api/annexes/${organizationId}/annex-e2/${annexId}/outflow`, outflowData);
        setOutflows([...outflows, response.data]);
        setCurrentOutflow(null);
      } catch (error) {
        console.error("Error creating outflow:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateOutflow = async () => {
    if (currentOutflow) {
      setIsLoading(true);
      try {
        const totalCost = currentOutflow.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
        const outflowData = {
          ...currentOutflow,
          date: currentOutflow.date,
          totalCost,
          items: currentOutflow.items.map(({ _id, ...item }) => item),
        };
        const response = await axios.put(
          `/api/annexes/${organizationId}/annex-e2/${annexId}/outflow/${currentOutflow._id}`,
          outflowData
        );
        setOutflows(outflows.map((outflow) => (outflow._id === currentOutflow._id ? response.data : outflow)));
        setCurrentOutflow(null);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating outflow:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveOutflow = async () => {
    if (currentOutflow) {
      setIsLoading(true);
      try {
        let imageUrl = currentOutflow.image;
        if (selectedFile) {
          imageUrl = await uploadImage(selectedFile);
        }

        const totalCost = currentOutflow.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
        const outflowData = {
          establishment: currentOutflow.establishment,
          date: currentOutflow.date,
          items: currentOutflow.items.map(({ _id, ...item }) => item),
          image: imageUrl,
          totalCost,
          event: currentOutflow.event,
        };

        let response;
        if (isEditing) {
          response = await axios.put(
            `/api/annexes/${organizationId}/annex-e2/${annexId}/outflow/${currentOutflow._id}`,
            outflowData
          );
        } else {
          response = await axios.post(`/api/annexes/${organizationId}/annex-e2/${annexId}/outflow`, outflowData);
        }

        if (response.status === 200 || response.status === 201) {
          if (isEditing) {
            setOutflows(outflows.map((outflow) => (outflow._id === currentOutflow._id ? response.data : outflow)));
          } else {
            setOutflows([...outflows, response.data]);
          }
          setCurrentOutflow(null);
          setSelectedFile(null);
          setPreviewUrl(null);
          setIsEditing(false);
          console.log("Outflow saved successfully");
        } else {
          throw new Error("Failed to save outflow");
        }
      } catch (error) {
        console.error("Error saving outflow:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInflowChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentInflow({
      ...currentInflow,
      [name]:
        name === "amount" || name === "payingParticipants" || name === "totalMembers" || name === "merchandiseSales"
          ? Number(value)
          : value,
    });
  };

  const createInflow = async () => {
    setIsLoading(true);
    try {
      const inflowData = {
        category: currentInflow.category,
        date: currentInflow.date,
        amount: currentInflow.amount,
        ...(currentInflow.category === "Registration Fee" && { payingParticipants: currentInflow.payingParticipants }),
        ...(currentInflow.category === "Membership Fee" && { totalMembers: currentInflow.totalMembers }),
        ...(currentInflow.category === "Merchandise Selling" && { merchandiseSales: currentInflow.merchandiseSales }),
      };
      const response = await axios.post(`/api/annexes/${organizationId}/annex-e2/${annexId}/inflow`, inflowData);
      setInflows([...inflows, response.data]);
      setCurrentInflow({
        _id: "",
        category: "",
        date: "",
        amount: 0,
        payingParticipants: 0,
        totalMembers: 0,
        merchandiseSales: 0,
      });
    } catch (error) {
      console.error("Error creating inflow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateInflow = async () => {
    setIsLoading(true);
    try {
      const inflowData = {
        category: currentInflow.category,
        date: currentInflow.date,
        amount: currentInflow.amount,
        ...(currentInflow.category === "Registration Fee" && { payingParticipants: currentInflow.payingParticipants }),
        ...(currentInflow.category === "Membership Fee" && { totalMembers: currentInflow.totalMembers }),
        ...(currentInflow.category === "Merchandise Selling" && { merchandiseSales: currentInflow.merchandiseSales }),
      };
      const response = await axios.put(
        `/api/annexes/${organizationId}/annex-e2/${annexId}/inflow/${currentInflow._id}`,
        inflowData
      );
      setInflows(inflows.map((inflow) => (inflow._id === currentInflow._id ? response.data : inflow)));
      setCurrentInflow({
        _id: "",
        category: "",
        date: "",
        amount: 0,
        payingParticipants: 0,
        totalMembers: 0,
        merchandiseSales: 0,
      });
      setIsEditingInflow(false);
    } catch (error) {
      console.error("Error updating inflow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingInflow) {
      await updateInflow();
    } else {
      await createInflow();
    }
  };

  const editInflow = (inflow: Inflow) => {
    setCurrentInflow({
      ...inflow,
      date: formatDate(inflow.date),
    });
    setIsEditingInflow(true);
  };

  const deleteInflow = async (inflowId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to archive this inflow?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`/api/annexes/${organizationId}/annex-e2/${annexId}/inflow/${inflowId}`);
      setInflows(inflows.filter((inflow) => inflow._id !== inflowId));
    } catch (error) {
      console.error("Error deleting inflow:", error);
    }
  };

  const deleteOutflow = async (outflowId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to archive this outflow?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`/api/annexes/${organizationId}/annex-e2/${annexId}/outflow/${outflowId}`);
      setOutflows(outflows.filter((outflow) => outflow._id !== outflowId));
    } catch (error) {
      console.error("Error deleting outflow:", error);
    }
  };

  const editOutflow = (outflow: Outflow) => {
    setLocalOutflow(outflow);
    setCurrentOutflow(outflow);
    setIsEditing(true);
    setPreviewUrl(outflow.image);
  };

  const cancelOutflow = () => {
    setCurrentOutflow(null);
    setLocalOutflow(null);
    setIsEditing(false);
  };

  const cancelEditInflow = () => {
    setCurrentInflow({
      _id: "",
      category: "",
      date: "",
      amount: 0,
      payingParticipants: 0,
      totalMembers: 0,
      merchandiseSales: 0,
    });
    setIsEditingInflow(false);
  };

  const isAddItemDisabled =
    !newItem.category ||
    !newItem.description ||
    !newItem.cost ||
    !newItem.quantity ||
    !newItem.serialNumber ||
    !newItem.expenseReportCategory;

  return (
    <PageWrapper>
      <BackButton />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-primary">Annex E-2: Financial Liquidation Report</h1>

          <div className="tabs tabs-boxed mb-8">
            <a className={`tab ${activeTab === "outflow" ? "tab-active" : ""}`} onClick={() => setActiveTab("outflow")}>
              Outflow
            </a>
            <a className={`tab ${activeTab === "inflow" ? "tab-active" : ""}`} onClick={() => setActiveTab("inflow")}>
              Inflow
            </a>
          </div>

          {activeTab === "outflow" && (
            <>
              {!currentOutflow && (
                <div className="mb-8 bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center text-neutral">
                    <Receipt className="mr-2" /> Upload a new receipt
                  </h2>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered file w-full"
                  />
                </div>
              )}

              <div>
                {currentOutflow && (
                  <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold flex items-center text-neutral">
                        <FileText className="mr-2" /> Receipt Description
                      </h2>
                      <button className="btn btn-ghost" onClick={cancelOutflow}>
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 gap-6 mb-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text flex items-center">
                                <Building2 className="mr-2" /> Establishment
                              </span>
                              <span className="text-xs text-primary">(required)</span>
                            </label>
                            <input
                              type="text"
                              name="establishment"
                              value={currentOutflow.establishment}
                              onChange={handleOutflowDescriptionChange}
                              className="input input-bordered w-full"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text flex items-center">
                                <Calendar className="mr-2" /> Date
                              </span>
                              <span className="text-xs text-primary">(required)</span>
                            </label>
                            <input
                              type="date"
                              name="date"
                              value={currentOutflow.date.split("T")[0]}
                              onChange={handleOutflowDescriptionChange}
                              className="input input-bordered w-full"
                              required
                              min={startDate}
                              max={endDate}
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text flex items-center">
                                <CalendarDays className="mr-2" /> Event (Create an event under annex E to be able to
                                make an outflow)
                              </span>
                              <span className="text-xs text-primary">(required)</span>
                            </label>
                            {eventsLoading ? (
                              <div className="flex items-center justify-center h-10">
                                <span className="loading loading-dots loading-md"></span>
                              </div>
                            ) : (
                              <select
                                name="event"
                                value={currentOutflow.event}
                                onChange={handleOutflowDescriptionChange}
                                className="select select-bordered w-full"
                                required
                              >
                                <option value="">Select an event</option>
                                {events.map((event) => (
                                  <option key={event._id} value={event._id}>
                                    {event.title} (E-Reserve: {event.eReserveNumber})
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4  flex items-center text-neutral">
                          <Layers className="mr-2" /> Items
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                          {currentOutflow.items.map((item) => (
                            <div key={item._id} className="border p-4 rounded-md shadow-sm">
                              {editingItem && editingItem._id === item._id ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text">Category</span>
                                      <span className="text-xs text-primary">(required)</span>
                                    </label>
                                    <select
                                      name="category"
                                      value={editingItem.category}
                                      onChange={handleItemChange}
                                      className="select select-bordered select-primary w-full"
                                      required
                                    >
                                      <option value="">Select a category</option>
                                      {outflowCategories.map((category) => (
                                        <option key={category} value={category}>
                                          {category}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text">Description</span>
                                      <span className="text-xs text-primary">(required)</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="description"
                                      value={editingItem.description}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length >= 4 && value.length <= 400) {
                                          handleItemChange(e);
                                        } else if (value.length < 4) {
                                          alert("Description must be at least 4 characters long.");
                                        } else {
                                          alert("Description cannot exceed 400 characters.");
                                        }
                                      }}
                                      className="input input-bordered w-full"
                                      required
                                    />
                                  </div>
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text flex items-center">
                                        <PhilippinePeso className="mr-1" size={16} /> Cost
                                      </span>
                                      <span className="text-xs text-primary">(required)</span>
                                    </label>
                                    <input
                                      type="number"
                                      name="cost"
                                      value={editingItem.cost}
                                      onChange={handleItemChange}
                                      className="input input-bordered w-full"
                                      required
                                    />
                                  </div>
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text">Quantity</span>
                                      <span className="text-xs text-primary">(required)</span>
                                    </label>
                                    <input
                                      type="number"
                                      name="quantity"
                                      value={editingItem.quantity}
                                      onChange={handleItemChange}
                                      className="input input-bordered w-full"
                                      required
                                    />
                                  </div>
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text flex items-center">
                                        <Hash className="mr-1" size={16} /> Transaction No.
                                      </span>
                                      <span className="text-xs text-primary">(required)</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="serialNumber"
                                      value={editingItem.serialNumber}
                                      onChange={handleItemChange}
                                      className="input input-bordered w-full"
                                    />
                                  </div>
                                  <div className="form-control">
                                    <label className="label">
                                      <span className="label-text">Expense Report Category</span>
                                      <span className="text-xs text-primary">(required)</span>
                                    </label>
                                    <select
                                      name="expenseReportCategory"
                                      value={editingItem.expenseReportCategory}
                                      onChange={handleItemChange}
                                      className="select select-bordered select-primary w-full"
                                      required
                                    >
                                      <option value="">Select a category</option>
                                      {expenseReportCategories.map((category) => (
                                        <option key={category} value={category}>
                                          {category}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <h4 className="font-semibold text-lg text-neutral">{item.description}</h4>
                                  <p className="text-sm text-neutral-content">Category: {item.category}</p>
                                  <p className="text-sm text-neutral-content">
                                    Cost: {formatMoney(item.cost).toString()}
                                  </p>
                                  <p className="text-sm text-neutral-content">Quantity: {item.quantity}</p>
                                  <p className="text-sm text-neutral-content">Serial No: {item.serialNumber}</p>
                                  <p className="text-sm text-neutral-content">
                                    Expense Report Category: {item.expenseReportCategory}
                                  </p>
                                </>
                              )}
                              <div className="flex justify-end mt-4">
                                {editingItem && editingItem._id === item._id ? (
                                  <>
                                    <button className="btn btn-primary btn-sm mr-2" onClick={updateItem}>
                                      Save
                                    </button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingItem(null)}>
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      className="btn btn-primary btn-sm mr-2"
                                      onClick={() => setEditingItem(item)}
                                    >
                                      Edit
                                    </button>
                                    <button className="btn btn-neutral btn-sm" onClick={() => deleteItem(item._id)}>
                                      Remove Item
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {!isAddingItem ? (
                          <button className="btn btn-primary" onClick={() => setIsAddingItem(true)}>
                            <Plus size={20} className="mr-2" /> Add Item
                          </button>
                        ) : (
                          <div className="bg-base-200 p-6 rounded-md shadow-sm mt-6">
                            <h4 className="font-semibold text-lg mb-4 flex items-center text-neutral">
                              <Plus className="mr-2" /> New Item
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">Category</span>
                                  <span className="text-xs text-primary">(required)</span>
                                </label>
                                <select
                                  name="category"
                                  value={newItem.category}
                                  onChange={handleItemChange}
                                  className="select select-bordered select-primary w-full"
                                  required
                                >
                                  <option value="">Select a category</option>
                                  {outflowCategories.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">Description</span>
                                  <span className="text-xs text-primary">(required)</span>
                                </label>
                                <input
                                  type="text"
                                  name="description"
                                  value={newItem.description}
                                  onChange={handleItemChange}
                                  className="input input-bordered w-full"
                                  required
                                />
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text flex items-center">
                                    <PhilippinePeso className="mr-1" size={16} /> Cost
                                  </span>
                                  <span className="text-xs text-primary">(required)</span>
                                </label>
                                <input
                                  type="number"
                                  name="cost"
                                  value={newItem.cost}
                                  onChange={handleItemChange}
                                  className="input input-bordered w-full"
                                  required
                                />
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">Quantity</span>
                                  <span className="text-xs text-primary">(required)</span>
                                </label>
                                <input
                                  type="number"
                                  name="quantity"
                                  value={newItem.quantity}
                                  onChange={handleItemChange}
                                  className="input input-bordered w-full"
                                  required
                                />
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text flex items-center">
                                    <Hash className="mr-1" size={16} /> Transaction No.
                                  </span>
                                  <span className="text-xs text-primary">(required)</span>
                                </label>
                                <input
                                  type="text"
                                  name="serialNumber"
                                  value={newItem.serialNumber}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                      handleItemChange(e);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight"];
                                    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
                                      e.preventDefault();
                                    }
                                  }}
                                  className="input input-bordered w-full"
                                />
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">Expense Report Category</span>
                                  <span className="text-xs text-primary">(required)</span>
                                </label>
                                <select
                                  name="expenseReportCategory"
                                  value={newItem.expenseReportCategory}
                                  onChange={handleItemChange}
                                  className="select select-bordered select-primary w-full"
                                  required
                                >
                                  <option value="">Select a category</option>
                                  {expenseReportCategories.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end mt-8">
                              <button className="btn btn-primary mr-2" onClick={addItem} disabled={isAddItemDisabled}>
                                Add Item
                              </button>
                              <button className="btn btn-ghost" onClick={() => setIsAddingItem(false)}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-neutral">Receipt Preview</h3>
                        {previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Receipt preview"
                            className="w-full h-auto object-contain rounded-lg shadow-md"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-8">
                      <button
                        className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                        onClick={saveOutflow}
                        disabled={isLoading || isReceiptSaveDisabled}
                      >
                        {isLoading ? "Saving..." : isEditing ? "Update Receipt" : "Save Receipt"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-neutral">
                  <Receipt className="mr-2" /> Saved Outflows
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {outflows.map((outflow) => (
                    <div
                      key={outflow._id}
                      className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                      onClick={() => editOutflow(outflow)}
                    >
                      {outflow.image && (
                        <img src={outflow.image} alt="Receipt" className="w-full h-40 object-cover rounded-lg mb-4" />
                      )}
                      <h3 className="text-xl font-semibold mb-2 text-neutral">{outflow.establishment}</h3>
                      <p className="text-neutral-content mb-1">Date: {new Date(outflow.date).toLocaleDateString()}</p>
                      <p className="text-neutral-content mb-1">Items: {outflow.items.length}</p>
                      <p className="text-lg font-semibold text-primary">
                        Total: {formatMoney(outflow.totalCost).toString()}
                      </p>
                      <button
                        className="btn btn-sm btn-neutral mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOutflow(outflow._id);
                        }}
                      >
                        Archive
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "inflow" && (
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold flex items-center text-neutral">
                  <Plus className="mr-2" /> {isEditingInflow ? "Edit" : "Add"} Inflow Transaction
                </h2>
                {isEditingInflow && (
                  <button className="btn btn-ghost" onClick={cancelEditInflow}>
                    <X size={20} />
                  </button>
                )}
              </div>
              <form onSubmit={saveInflow} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                    <span className="text-xs text-primary">(required)</span>
                  </label>
                  <select
                    name="category"
                    value={currentInflow.category}
                    onChange={handleInflowChange}
                    className="select select-bordered select-primary w-full"
                    required
                  >
                    <option value="">Select a category</option>
                    {inflowCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center">
                      <Calendar className="mr-2" /> Date
                    </span>
                    <span className="text-xs text-primary">(required)</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={currentInflow.date}
                    onChange={handleInflowChange}
                    className="input input-bordered w-full"
                    required
                    min={startDate}
                    max={endDate}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center">
                      <PhilippinePeso className="mr-2" /> Amount
                    </span>
                    <span className="text-xs text-primary">(required)</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={currentInflow.amount}
                    onChange={handleInflowChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                {currentInflow.category === "Registration Fee" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center">
                        <Users className="mr-2" /> Total Number of Paying Participants
                      </span>
                    </label>
                    <input
                      type="number"
                      name="payingParticipants"
                      value={currentInflow.payingParticipants}
                      onChange={handleInflowChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                )}
                {currentInflow.category === "Membership Fee" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center">
                        <Users className="mr-2" /> Total Number of Members
                      </span>
                    </label>
                    <input
                      type="number"
                      name="totalMembers"
                      value={currentInflow.totalMembers}
                      onChange={handleInflowChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                )}
                {currentInflow.category === "Merchandise Selling" && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center">
                        <ShoppingBag className="mr-2" /> Total Number of Sales
                      </span>
                    </label>
                    <input
                      type="number"
                      name="merchandiseSales"
                      value={currentInflow.merchandiseSales}
                      onChange={handleInflowChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                )}
                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : isEditingInflow ? "Update Inflow" : "Add Inflow"}
                  </button>
                </div>
              </form>

              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-neutral">
                  <Receipt className="mr-2" /> Inflow Transactions
                </h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Additional Info</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inflows.map((inflow) => (
                        <tr key={inflow._id}>
                          <td>{inflow.category}</td>
                          <td>{formatDate(inflow.date)}</td>
                          <td> {formatMoney(inflow.amount).toString()}</td>
                          <td>
                            {inflow.category === "Registration Fee" &&
                              `Paying Participants: ${inflow.payingParticipants}`}
                            {inflow.category === "Membership Fee" && `Total Members: ${inflow.totalMembers}`}
                            {inflow.category === "Merchandise Selling" && `Total Sales: ${inflow.merchandiseSales}`}
                          </td>
                          <td>
                            <button className="btn btn-sm btn-primary mr-2" onClick={() => editInflow(inflow)}>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-neutral" onClick={() => deleteInflow(inflow._id)}>
                              Archive
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
