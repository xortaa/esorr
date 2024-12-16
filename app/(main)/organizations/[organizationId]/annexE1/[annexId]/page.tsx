"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import axios from "axios";
import { PhilippinePeso, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import BackButton from "@/components/BackButton";
import formatMoney from "@/utils/formatMoney";

interface OutflowItem {
  category: string;
  description: string;
  cost: number;
  quantity: number;
  serialNumber: string;
}

interface Transaction {
  date: string;
  amount: number;
  type: "inflow" | "outflow";
  category: string;
  description: string;
  establishment?: string;
  items?: OutflowItem[];
  payingParticipants?: number;
  totalMembers?: number;
  merchandiseSales?: number;
}

interface MonthData {
  startingBalance: number;
  endingBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

interface FinancialReport {
  _id: string;
  annexE1: string;
  academicYear: string;
  startingBalance: number;
  transactions: Transaction[];
  june: MonthData;
  july: MonthData;
  august: MonthData;
  september: MonthData;
  october: MonthData;
  november: MonthData;
  december: MonthData;
  january: MonthData;
  february: MonthData;
  march: MonthData;
  april: MonthData;
  may: MonthData;
  totalIncome: number;
  totalExpenses: number;
  endingBalance: number;
}

const months = [
  "august",
  "september",
  "october",
  "november",
  "december",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
];

interface MonthSectionProps {
  month: string;
  data: MonthData;
  transactions: Transaction[];
}

const MonthSection: React.FC<MonthSectionProps> = ({ month, data, transactions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 bg-base-200 rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-lg font-bold capitalize">{month}</h3>
        <div className="flex items-center">
          <span className="mr-2">
            Balance:{" "}
            {data.endingBalance !== undefined && data.endingBalance !== null
              ? formatMoney(data.endingBalance).toString()
              : ""}
          </span>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 bg-white">
          <h4 className="text-lg font-semibold mb-2">Inflows</h4>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Category</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Additional Info</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((t) => t.type === "inflow")
                .map((transaction, index) => (
                  <tr key={index} className="text-green-600">
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.category}</td>
                    <td className="text-right">
                      {transaction.amount !== undefined && transaction.amount !== null
                        ? formatMoney(transaction.amount).toString()
                        : ""}
                    </td>
                    <td className="text-right">
                      {transaction.payingParticipants && `Participants: ${transaction.payingParticipants}`}
                      {transaction.totalMembers && `Members: ${transaction.totalMembers}`}
                      {transaction.merchandiseSales && `Sales: ${transaction.merchandiseSales}`}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h4 className="text-lg font-semibold mb-2">Outflows</h4>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Establishment</th>
                <th className="text-left">Category</th>
                <th className="text-left">Description</th>
                <th className="text-right">Quantity</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((t) => t.type === "outflow")
                .map((transaction, index) =>
                  transaction.items?.map((item, itemIndex) => (
                    <tr key={`${index}-${itemIndex}`} className="text-red-600">
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.establishment}</td>
                      <td>{item.category}</td>
                      <td>{item.description}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">
                        {item.cost !== undefined &&
                        item.quantity !== undefined &&
                        item.cost !== null &&
                        item.quantity !== null
                          ? formatMoney(item.cost * item.quantity).toString()
                          : ""}
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>

          <div className="font-bold">
            <p>
              Total Income:{" "}
              {data.totalIncome !== undefined && data.totalIncome !== null
                ? formatMoney(data.totalIncome).toString()
                : ""}
            </p>
            <p>
              Total Expenses:{" "}
              {data.totalExpenses !== undefined && data.totalExpenses !== null
                ? formatMoney(data.totalExpenses).toString()
                : ""}
            </p>
            <p>
              Balance:{" "}
              {data.endingBalance !== undefined && data.endingBalance !== null
                ? formatMoney(data.endingBalance).toString()
                : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AnnexE1FinancialSummary() {
  const params = useParams();
  const organizationId = params.organizationId as string;
  const annexId = params.annexId as string;
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);

  useEffect(() => {
    const fetchFinancialReport = async () => {
      try {
        const response = await axios.get(`/api/annexes/${organizationId}/annex-e1/${annexId}/financial-report`);
        setFinancialReport(response.data[0]);
      } catch (error) {
        console.error(
          "Error fetching financial report:",

          error
        );
      }
    };

    fetchFinancialReport();
  }, [organizationId, annexId]);

  if (!financialReport) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      <BackButton />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Annex E-1: Financial Summary Report</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">Total Income</h2>
              <p className="text-2xl font-bold">
                {financialReport.totalIncome !== undefined && financialReport.totalIncome !== null
                  ? formatMoney(financialReport.totalIncome).toString()
                  : ""}
              </p>
              <p className="text-xs text-black opacity-100">
                <ArrowUpRight className="inline mr-1" />
                Total funds received
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">Total Expenses</h2>
              <p className="text-2xl font-bold">
                {financialReport.totalExpenses !== undefined && financialReport.totalExpenses !== null
                  ? formatMoney(financialReport.totalExpenses).toString()
                  : ""}
              </p>
              <p className="text-xs text-black opacity-100">
                <ArrowDownRight className="inline mr-1" />
                Total expenditures
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm">Balance</h2>
              <p className="text-2xl font-bold">
                {financialReport.endingBalance !== undefined && financialReport.endingBalance !== null
                  ? formatMoney(financialReport.endingBalance).toString()
                  : ""}
              </p>
              <p className="text-xs text-black opacity-100">
                <Calendar className="inline mr-1" />
                Academic Year Total
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {months.map((month) => (
            <MonthSection
              key={month}
              month={month}
              data={financialReport[month as keyof FinancialReport] as MonthData}
              transactions={financialReport.transactions.filter(
                (t) => new Date(t.date).toLocaleString("default", { month: "long" }).toLowerCase() === month
              )}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
