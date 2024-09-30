"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Plus,
  X,
  Edit,
  Trash,
  Receipt,
  Calendar,
  PhilippinePeso,
  Hash,
  Layers,
  FileText,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Receipt {
  id: string;
  file: File;
  establishment: string;
  date: string;
  items: OutflowItem[];
  previewUrl?: string;
}

interface OutflowItem {
  id: string;
  category: string;
  details: string;
  cost: number;
  quantity: number;
  serialNo: string;
}

interface InflowTransaction {
  id: string;
  category: string;
  date: string;
  amount: number;
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

export default function AnnexE2FinancialLiquidationReport() {
  const [activeTab, setActiveTab] = useState<"outflow" | "inflow">("outflow");
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<OutflowItem>({
    id: "",
    category: "",
    details: "",
    cost: 0,
    quantity: 1,
    serialNo: "",
  });
  const [inflowTransactions, setInflowTransactions] = useState<InflowTransaction[]>([]);
  const [newInflowTransaction, setNewInflowTransaction] = useState<InflowTransaction>({
    id: "",
    category: "",
    date: "",
    amount: 0,
  });

  useEffect(() => {
    return () => {
      receipts.forEach((receipt) => {
        if (receipt.previewUrl) {
          URL.revokeObjectURL(receipt.previewUrl);
        }
      });
    };
  }, [receipts]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      const newReceipt: Receipt = {
        id: Date.now().toString(),
        file: file,
        establishment: "",
        date: "",
        items: [],
        previewUrl: previewUrl,
      };
      setCurrentReceipt(newReceipt);
    }
  };

  const handleReceiptDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentReceipt) {
      setCurrentReceipt({ ...currentReceipt, [e.target.name]: e.target.value });
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: name === "cost" || name === "quantity" ? Number(value) : value });
  };

  const addItem = () => {
    if (currentReceipt) {
      const updatedReceipt = {
        ...currentReceipt,
        items: [...currentReceipt.items, { ...newItem, id: Date.now().toString() }],
      };
      setCurrentReceipt(updatedReceipt);
      setNewItem({
        id: "",
        category: "",
        details: "",
        cost: 0,
        quantity: 1,
        serialNo: "",
      });
      setIsAddingItem(false);
    }
  };

  const saveReceipt = () => {
    if (currentReceipt) {
      setReceipts([...receipts, currentReceipt]);
      setCurrentReceipt(null);
    }
  };

  const handleInflowTransactionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewInflowTransaction({ ...newInflowTransaction, [name]: name === "amount" ? Number(value) : value });
  };

  const addInflowTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction = { ...newInflowTransaction, id: Date.now().toString() };
    setInflowTransactions([...inflowTransactions, newTransaction]);
    setNewInflowTransaction({
      id: "",
      category: "",
      date: "",
      amount: 0,
    });
  };

  return (
    <PageWrapper>
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
              {!currentReceipt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 bg-white p-8 rounded-lg shadow-md"
                >
                  <h2 className="text-2xl font-semibold mb-4 flex items-center text-neutral">
                    <Receipt className="mr-2" /> Upload a new receipt
                  </h2>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered file w-full"
                  />
                </motion.div>
              )}

              <AnimatePresence>
                {currentReceipt && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-8 rounded-lg shadow-md mb-8"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center text-neutral">
                          <FileText className="mr-2" /> Receipt Details
                        </h2>
                        <div className="grid grid-cols-1 gap-6 mb-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text flex items-center">
                                <Building2 className="mr-2" /> Establishment
                              </span>
                            </label>
                            <input
                              type="text"
                              name="establishment"
                              value={currentReceipt.establishment}
                              onChange={handleReceiptDetailsChange}
                              className="input input-bordered w-full"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text flex items-center">
                                <Calendar className="mr-2" /> Date
                              </span>
                            </label>
                            <input
                              type="date"
                              name="date"
                              value={currentReceipt.date}
                              onChange={handleReceiptDetailsChange}
                              className="input input-bordered w-full"
                              required
                            />
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4 flex items-center text-neutral">
                          <Layers className="mr-2" /> Items
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                          {currentReceipt.items.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="border p-4 rounded-md shadow-sm"
                            >
                              <h4 className="font-semibold text-lg text-neutral">{item.details}</h4>
                              <p className="text-sm text-neutral-content">Category: {item.category}</p>
                              <p className="text-sm text-neutral-content">Cost: ₱{item.cost}</p>
                              <p className="text-sm text-neutral-content">Quantity: {item.quantity}</p>
                              <p className="text-sm text-neutral-content">Serial No: {item.serialNo}</p>
                            </motion.div>
                          ))}
                        </div>

                        {!isAddingItem ? (
                          <button className="btn btn-primary" onClick={() => setIsAddingItem(true)}>
                            <Plus size={20} className="mr-2" /> Add Item
                          </button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-base-200 p-6 rounded-md shadow-sm mt-6"
                          >
                            <h4 className="font-semibold text-lg mb-4 flex items-center text-neutral">
                              <Plus className="mr-2" /> New Item
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text">Category</span>
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
                                  <span className="label-text">Details/Description</span>
                                </label>
                                <input
                                  type="text"
                                  name="details"
                                  value={newItem.details}
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
                                    <Hash className="mr-1" size={16} /> Serial No.
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  name="serialNo"
                                  value={newItem.serialNo}
                                  onChange={handleItemChange}
                                  className="input input-bordered w-full"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end mt-8">
                              <button className="btn btn-primary mr-2" onClick={addItem}>
                                Add Item
                              </button>
                              <button className="btn btn-ghost" onClick={() => setIsAddingItem(false)}>
                                Cancel
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-neutral">Receipt Preview</h3>
                        {currentReceipt.previewUrl && (
                          <img
                            src={currentReceipt.previewUrl}
                            alt="Receipt preview"
                            className="w-full h-auto object-contain rounded-lg shadow-md"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-8">
                      <button className="btn btn-primary" onClick={saveReceipt}>
                        Save Receipt
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-12"
              >
                <h2 className="text-3xl font-bold mb-6 flex items-center text-neutral">
                  <Receipt className="mr-2" /> Saved Receipts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {receipts.map((receipt) => (
                    <motion.div
                      key={receipt.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-lg shadow-md"
                    >
                      {receipt.previewUrl && (
                        <img
                          src={receipt.previewUrl}
                          alt="Receipt preview"
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-semibold mb-2 text-neutral">{receipt.establishment}</h3>
                      <p className="text-neutral-content mb-1">Date: {receipt.date}</p>
                      <p className="text-neutral-content mb-1">Items: {receipt.items.length}</p>
                      <p className="text-lg font-semibold text-primary">
                        Total: ₱{receipt.items.reduce((sum, item) => sum + item.cost * item.quantity, 0).toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "inflow" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-lg shadow-md mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center text-neutral">
                <Plus className="mr-2" /> Add Inflow Transaction
              </h2>
              <form onSubmit={addInflowTransaction} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    name="category"
                    value={newInflowTransaction.category}
                    onChange={handleInflowTransactionChange}
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
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newInflowTransaction.date}
                    onChange={handleInflowTransactionChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center">
                      <PhilippinePeso className="mr-2" /> Amount
                    </span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={newInflowTransaction.amount}
                    onChange={handleInflowTransactionChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">
                    Add Inflow Transaction
                  </button>
                </div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-12"
              >
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
                      </tr>
                    </thead>
                    <tbody>
                      {inflowTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{transaction.category}</td>
                          <td>{transaction.date}</td>
                          <td>₱ {transaction.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
