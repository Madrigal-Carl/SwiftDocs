import { useState, useEffect } from "react";
import SectionHeader from "../../layouts/SectionHeader";
import ReportStats from "../../components/reports/ReportStats";
import RequestStatisticsTab from "../../components/reports/RequestStatisticsTab";
import IncomeReportsTab from "../../components/reports/IncomeReportsTab";
import DocumentTypeTab from "../../components/reports/DocumentTypeTab";
import { useRequestStore } from "../../stores/request_store";
import { useDocumentStore } from "../../stores/document_store";
import { fetchRequestAnalytics } from "../../services/request_service";
import { getDocumentAnalytics } from "../../services/document_service";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Filter, ChevronDown } from "lucide-react";

export default function Content() {
  const [activeTab, setActiveTab] = useState("requestStats");
  const [timeframe, setTimeframe] = useState("year");
  const { stats: requestStats, loadAnalytics } = useRequestStore();
  const { stats: documentStats } = useDocumentStore();

  const paidCount = requestStats?.countByStatus?.paid ?? 0;
  const releasedCount = requestStats?.countByStatus?.released ?? 0;
  const totalPaidReleased = paidCount + releasedCount;

  const { loadAnalytics: loadDocumentAnalytics } = useDocumentStore();

  useEffect(() => {
    loadAnalytics(timeframe);
    loadDocumentAnalytics(timeframe);
  }, [timeframe, loadAnalytics, loadDocumentAnalytics]);

  const timeframeFilter = (
    <div className="relative">
      <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <select
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        className="appearance-none pl-10 pr-9 px-6 py-3.5 h-full min-w-40 rounded-lg border border-(--border-light) focus:outline-none focus:ring-2 focus:ring-(--primary-300) text-sm cursor-pointer"
      >
        <option value="year">This Year</option>
        <option value="month">This Month</option>
        <option value="week">This Week</option>
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  const tabs = [
    { id: "requestStats", label: "Request Statistics" },
    { id: "incomeReports", label: "Income Reports" },
    { id: "documentTypes", label: "Document Type" },
  ];

  const handleExport = async () => {
    const reportStats = await fetchRequestAnalytics(timeframe);
    const documentStatsFromApi = await getDocumentAnalytics(timeframe);

    const paidReleasedRequests = reportStats?.paidReleasedRequests || [];
    const paidCount = reportStats?.countByStatus?.paid ?? 0;
    const releasedCount = reportStats?.countByStatus?.released ?? 0;
    const totalPaidReleased = paidCount + releasedCount;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const title = "SwiftDocs Report";

    doc.setFontSize(16);
    doc.text(title, 40, 40);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 58);
    doc.text("Included statuses: paid, released", 40, 72);

    autoTable(doc, {
      startY: 90,
      head: [["Metric", "Value"]],
      body: [
        ["Paid requests", paidCount],
        ["Released requests", releasedCount],
        ["Total paid/released requests", totalPaidReleased],
      ],
      theme: "grid",
      headStyles: { fillColor: "#3b82f6", textColor: "#fff" },
    });

    const yAfterSummary = doc.lastAutoTable.finalY + 20;

    const requestsByMonth = reportStats?.monthlyPaidReleasedRequests || [];
    autoTable(doc, {
      startY: yAfterSummary,
      head: [["Period", "Paid/Released Requests"]],
      body: requestsByMonth.map((row) => [
        row.period || row.month,
        row.requests,
      ]),
      theme: "grid",
      headStyles: { fillColor: "#0ea5e9", textColor: "#fff" },
    });

    const yAfterRequests = doc.lastAutoTable.finalY + 20;

    const revenueByMonth = reportStats?.monthlyRevenue || [];
    autoTable(doc, {
      startY: yAfterRequests,
      head: [["Month", "Revenue (PHP)"]],
      body: revenueByMonth.map((row) => [
        row.month,
        `PHP ${Number(row.revenue || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ]),
      theme: "grid",
      headStyles: { fillColor: "#10b981", textColor: "#fff" },
    });

    const yAfterRevenue = doc.lastAutoTable.finalY + 20;

    const documentTypeRows = Object.entries(documentStatsFromApi || {}).map(
      ([type, count]) => [type, count],
    );

    const yAfterDocumentType = yAfterRevenue + 1;

    if (documentTypeRows.length > 0) {
      autoTable(doc, {
        startY: yAfterDocumentType,
        head: [["Document Type", "Quantity Sold"]],
        body: documentTypeRows,
        theme: "grid",
        headStyles: { fillColor: "#8b5cf6", textColor: "#fff" },
      });
    } else {
      doc.text("No document type data available.", 40, yAfterDocumentType + 20);
    }

    const yAfterDocumentTypeTable = doc.lastAutoTable
      ? doc.lastAutoTable.finalY + 20
      : yAfterDocumentType + 40;

    if (paidReleasedRequests.length > 0) {
      autoTable(doc, {
        startY: yAfterDocumentTypeTable,
        head: [
          [
            "Reference",
            "Student",
            "Request Date",
            "Status",
            "Total Price (PHP)",
          ],
        ],
        body: paidReleasedRequests.map((item) => {
          const dateValue = item.request_date
            ? new Date(item.request_date).toLocaleDateString()
            : "";
          return [
            item.reference_number || "",
            item.student || "",
            dateValue,
            item.status || "",
            `PHP ${Number(item.total_price || 0).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          ];
        }),
        theme: "grid",
        headStyles: { fillColor: "#f97316", textColor: "#fff" },
      });
    } else {
      doc.text(
        "No paid/released request payments found.",
        40,
        yAfterDocumentTypeTable + 20,
      );
    }

    const filename = `SwiftDocs_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <SectionHeader
        title="Reports & Analytics"
        description="Track performance metrics and document request insights"
        actionLabel="Export Report"
        onAction={handleExport}
        actionExtra={timeframeFilter}
        icon={Download}
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
