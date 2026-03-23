import { useState } from "react";
import ContentHeader from "../../layouts/ContentHeader";
import ReportStats from "../../components/reports/ReportStats";
import RequestStatisticsTab from "../../components/reports/RequestStatisticsTab";
import IncomeReportsTab from "../../components/reports/IncomeReportsTab";
import DocumentTypeTab from "../../components/reports/DocumentTypeTab";

export default function Content() {
  const [activeTab, setActiveTab] = useState("requestStats");

  const tabs = [
    { id: "requestStats", label: "Request Statistics" },
    { id: "incomeReports", label: "Income Reports" },
    { id: "documentTypes", label: "Document Type" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <ContentHeader
        title="Reports & Analytics"
        description="Track performance metrics and document request insights"
      />

      <ReportStats />

      <div className="flex items-center gap-1 p-1 bg-(--primary-100)/50 rounded-xl w-fit mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "requestStats" && <RequestStatisticsTab />}
        {activeTab === "incomeReports" && <IncomeReportsTab />}
        {activeTab === "documentTypes" && <DocumentTypeTab />}
      </div>
    </div>
  );
}
