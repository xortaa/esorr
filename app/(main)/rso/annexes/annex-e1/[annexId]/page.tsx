"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { PhilippinePeso, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from "lucide-react";

// Mock data - replace with actual data from Annex E-2
const mockData = {
  membershipFee: {
    total: 50000,
    details: [
      { description: "Number of Members (1st Semester)", amount: 30000 },
      { description: "Number of Members (2nd Semester)", amount: 20000 },
    ],
  },
  registrationFee: {
    total: 75000,
    details: [
      { description: "Event A - 150 participants", amount: 45000 },
      { description: "Event B - 100 participants", amount: 30000 },
    ],
  },
  merchandiseSales: {
    total: 25000,
    details: [
      { description: "T-shirts - 100 pcs", amount: 15000 },
      { description: "Mugs - 50 pcs", amount: 10000 },
    ],
  },
  subsidies: {
    total: 100000,
    details: [
      { description: "Student Activity Fund", amount: 50000 },
      { description: "Community Service Fund", amount: 20000 },
      { description: "University-Wide Student Organization Fund", amount: 30000 },
    ],
  },
  expenses: {
    total: 200000,
    details: [
      { description: "Food Expense", amount: 50000 },
      { description: "Transportation", amount: 30000 },
      { description: "Office Supplies", amount: 20000 },
      { description: "Physical Arrangement", amount: 40000 },
      { description: "Documentation", amount: 15000 },
      { description: "Promotions", amount: 25000 },
      { description: "Miscellaneous Expense", amount: 20000 },
    ],
  },
};

interface SectionProps {
  title: string;
  data: {
    total: number;
    details: Array<{ description: string; amount: number }>;
  };
  bgColor: string;
}

const Section: React.FC<SectionProps> = ({ title, data, bgColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`mb-4 ${bgColor} rounded-lg overflow-hidden`}>
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="flex items-center">
          <span className="mr-2">₱{data.total.toLocaleString()}</span>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 bg-white">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Description</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.details.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td className="text-right">₱{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function AnnexE1FinancialSummary() {
  const totalIncome =
    mockData.membershipFee.total +
    mockData.registrationFee.total +
    mockData.merchandiseSales.total +
    mockData.subsidies.total;
  const totalExpenses = mockData.expenses.total;
  const balance = totalIncome - totalExpenses;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Annex E-1: Financial Summary Report</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">
                Total Income
                <PhilippinePeso className="h-4 w-4 text-base-content opacity-70" />
              </h2>
              <p className="text-2xl font-bold">₱{totalIncome.toLocaleString()}</p>
              <p className="text-xs text-base-content opacity-70">
                <ArrowUpRight className="inline mr-1" />
                Total funds received
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">
                Total Expenses
                <PhilippinePeso className="h-4 w-4 text-base-content opacity-70" />
              </h2>
              <p className="text-2xl font-bold">₱{totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-base-content opacity-70">
                <ArrowDownRight className="inline mr-1" />
                Total expenditures
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">
                Balance
                <PhilippinePeso className="h-4 w-4 text-base-content opacity-70" />
              </h2>
              <p className="text-2xl font-bold">₱{balance.toLocaleString()}</p>
              <p className="text-xs text-base-content opacity-70">Remaining funds</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Section title="Membership Fee" data={mockData.membershipFee} bgColor="bg-gray-200" />
          <Section title="Registration Fee" data={mockData.registrationFee} bgColor="bg-blue-200" />
          <Section title="Merchandise Sales" data={mockData.merchandiseSales} bgColor="bg-yellow-200" />
          <Section title="Subsidies" data={mockData.subsidies} bgColor="bg-green-200" />
          <Section title="Expenses" data={mockData.expenses} bgColor="bg-red-200" />
        </div>
      </div>
    </PageWrapper>
  );
}
