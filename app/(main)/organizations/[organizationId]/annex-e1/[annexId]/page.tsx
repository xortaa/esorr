"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { PhilippinePeso, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, Calendar, Activity, Users, ShoppingBag } from "lucide-react";

// Mock data - replace with actual data from Annex E-2
const mockData = {
  months: [
    "June", "July", "August", "September", "October", "November",
    "December", "January", "February", "March", "April", "May"
  ],
  categories: [
    { 
      name: "Membership Fee", 
      color: "bg-[#7f7f7f]",
      totalMembers: 150,
      activities: [
        { name: "First Semester Membership", amount: 30000, members: 100 },
        { name: "Second Semester Membership", amount: 20000, members: 50 },
      ]
    },
    { 
      name: "Registration Fee", 
      color: "bg-[#d0cece]",
      activities: [
        { name: "Annual Conference", amount: 50000, participants: 100 },
        { name: "Workshop Series", amount: 25000, participants: 50 },
      ]
    },
    { 
      name: "Merchandise Sales", 
      color: "bg-[#ffc000]",
      activities: [
        { name: "T-shirts", amount: 15000, sales: 100 },
        { name: "Mugs", amount: 10000, sales: 50 },
      ]
    },
    { 
      name: "Subsidies", 
      color: "bg-gray-200", 
      subcategories: [
        { 
          name: "Student Activity Fund", 
          color: "bg-[#ececec]",
          activities: [
            { name: "Leadership Training", amount: 20000 },
            { name: "Cultural Night", amount: 15000 },
          ]
        },
        { 
          name: "Community Service Fund", 
          color: "bg-[#fef2cb]",
          activities: [
            { name: "Outreach Program", amount: 10000 },
            { name: "Environmental Campaign", amount: 5000 },
          ]
        },
        { 
          name: "University-Wide Student Organization Fund", 
          color: "bg-[#deeaf6]",
          activities: [
            { name: "Annual University Fair", amount: 25000 },
            { name: "Inter-College Sports Fest", amount: 20000 },
          ]
        },
        { 
          name: "CSC/SOCC Fund", 
          color: "bg-[#d0cece]",
          activities: [
            { name: "Student Council Summit", amount: 15000 },
            { name: "Academic Excellence Awards", amount: 10000 },
          ]
        },
        { 
          name: "Local Student Council Fund", 
          color: "bg-[#e2efd9]",
          activities: [
            { name: "Department Welcome Party", amount: 8000 },
            { name: "Career Orientation Seminar", amount: 7000 },
          ]
        },
        { 
          name: "Cash Sponsorship", 
          color: "bg-gray-200",
          activities: [
            { name: "Corporate Sponsorship for Annual Ball", amount: 30000 },
            { name: "Alumni Donation for Scholarship Fund", amount: 20000 },
          ]
        },
      ]
    },
    { name: "Expenses", color: "bg-red-200" }
  ],
  data: [
    [10000, 5000, 15000, 5000, 5000, 5000, 0, 0, 5000, 0, 0, 0],
    [0, 30000, 0, 0, 45000, 0, 0, 0, 0, 0, 0, 0],
    [5000, 5000, 5000, 2000, 2000, 2000, 1000, 1000, 1000, 1000, 0, 0],
    [50000, 0, 0, 0, 0, 50000, 0, 0, 0, 0, 0, 0],
    [20000, 25000, 15000, 20000, 30000, 25000, 10000, 15000, 20000, 10000, 5000, 5000]
  ]
};

interface MonthSectionProps {
  month: string;
  data: number[];
  categories: any[];
}

const MonthSection: React.FC<MonthSectionProps> = ({ month, data, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalIncome = data.slice(0, -1).reduce((sum, val) => sum + val, 0);
  const totalExpenses = data[data.length - 1];
  const balance = totalIncome - totalExpenses;

  return (
    <div className="mb-4 bg-base-200 rounded-lg overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-bold">{month}</h3>
        <div className="flex items-center">
          <span className="mr-2">Balance: ₱{balance.toLocaleString()}</span>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 bg-white">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Category</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                category.name === "Subsidies" ? (
                  <tr key={index} className={`${category.color}`}>
                    <td colSpan={3}>
                      <details>
                        <summary className="font-bold cursor-pointer">{category.name}</summary>
                        <table className="w-full mt-2">
                          <tbody>
                            {category.subcategories.map((subcategory: any, subIndex: number) => (
                              <tr key={subIndex} className={subcategory.color}>
                                <td className="pl-4">
                                  <details>
                                    <summary className="font-semibold cursor-pointer">{subcategory.name}</summary>
                                    <table className="w-full mt-1">
                                      <tbody>
                                        {subcategory.activities.map((activity: any, actIndex: number) => (
                                          <tr key={actIndex}>
                                            <td className="pl-8">{activity.name}</td>
                                            <td className="text-right">₱{activity.amount.toLocaleString()}</td>
                                            <td></td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </details>
                                </td>
                                <td className="text-right">₱{subcategory.activities.reduce((sum: number, act: any) => sum + act.amount, 0).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </details>
                    </td>
                  </tr>
                ) : (
                  <tr key={index} className={`${category.color}`}>
                    <td>
                      <details>
                        <summary className="font-bold cursor-pointer">{category.name}</summary>
                        <table className="w-full mt-2">
                          <tbody>
                            {category.activities && category.activities.map((activity: any, actIndex: number) => (
                              <tr key={actIndex}>
                                <td className="pl-4">{activity.name}</td>
                                <td className="text-right">₱{activity.amount.toLocaleString()}</td>
                                <td className="text-right">
                                  {category.name === "Membership Fee" && `Members: ${activity.members}`}
                                  {category.name === "Registration Fee" && `Participants: ${activity.participants}`}
                                  {category.name === "Merchandise Sales" && `Sales: ${activity.sales}`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </details>
                    </td>
                    <td className="text-right">₱{data[index].toLocaleString()}</td>
                    <td className="text-right">
                      {category.name === "Membership Fee" && `Total Members: ${category.totalMembers}`}
                      {category.name === "Registration Fee" && `Total Participants: ${category.activities.reduce((sum: number, act: any) => sum + act.participants, 0)}`}
                      {category.name === "Merchandise Sales" && `Total Sales: ${category.activities.reduce((sum: number, act: any) => sum + act.sales, 0)}`}
                    </td>
                  </tr>
                )
              ))}
              <tr className="font-bold border-t">
                <td>Total Income</td>
                <td className="text-right">₱{totalIncome.toLocaleString()}</td>
                <td></td>
              </tr>
              <tr className="font-bold">
                <td>Total Expenses</td>
                <td className="text-right">₱{totalExpenses.toLocaleString()}</td>
                <td></td>
              </tr>
              <tr className="font-bold">
                <td>Balance</td>
                <td className="text-right">₱{balance.toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function AnnexE1FinancialSummary() {
  const totalIncome = mockData.data.slice(0, -1).reduce((sum, category) => sum + category.reduce((a, b) => a + b, 0), 0);
  const totalExpenses = mockData.data[mockData.data.length - 1].reduce((a, b) => a + b, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">
          Annex E-1: Financial Summary Report
        </h1>

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
              <p className="text-xs text-base-content opacity-70">
                <Calendar className="inline mr-1" />
                Academic Year Total
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {mockData.months.map((month, index) => (
            <MonthSection 
              key={month} 
              month={month} 
              data={mockData.data.map(category => category[index])}
              categories={mockData.categories}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}