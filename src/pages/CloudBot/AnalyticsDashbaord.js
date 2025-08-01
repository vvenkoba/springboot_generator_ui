import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement, Legend } from "chart.js";
import { FaProjectDiagram, FaFileAlt, FaRocket, FaCheckCircle, FaDatabase, FaBug } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement, Legend);

const AnalyticsDashboard = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const summaryMetrics = [
        { title: "Total Base Models", value: "50+", icon: <FaDatabase />, description: "Number of databases successfully optimized." },
        { title: "Total Templates", value: "20+", icon: <FaFileAlt />, description: "Reusable templates created for automation." },
        
        { title: "Total Pipelines", value: "95+", icon: <FaProjectDiagram />, description: "Total CI/CD pipelines deployed successfully." },
        { title: "Custom Model Trained", value: "5", icon: <FaRocket />, description: "Counts of successfully trained custom models." },
       
        { title: "Test Case Generation", value: "30%", icon: <FaCheckCircle />, description: "Improvement in efficiency post-migration." },
        { title: "Error Rate Reduction", value: "65%", icon: <FaBug />, description: "Decrease in system errors after migration." },

    ];

    const tableData = [
        { project: "Frontend Refactor", lines: "5,000", success: "95%", issues: "Low" },
        { project: "Backend Migration", lines: "8,200", success: "89%", issues: "Medium" },
        { project: "Database Optimization", lines: "2,800", success: "92%", issues: "Low" },
        { project: "API Enhancements", lines: "3,500", success: "90%", issues: "Medium" },
        { project: "UI Overhaul", lines: "7,000", success: "85%", issues: "High" },
        { project: "Security Patching", lines: "6,500", success: "94%", issues: "Low" },
        { project: "Performance Tuning", lines: "4,200", success: "88%", issues: "Medium" },
        { project: "Cloud Migration", lines: "9,100", success: "87%", issues: "High" }
    ];

    const migrationSuccessData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
            label: "Migration Success Rate (%)",
            data: [80, 85, 90, 87, 92, 95],
            backgroundColor: "rgba(54, 162, 235, 0.6)",
        }]
    };

    const codeOptimizationData = {
        labels: ["Pre-Migration", "Post-Migration"],
        datasets: [{
            label: "Code Efficiency Improvement (%)",
            data: [50, 80],
            backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(75, 192, 192, 0.6)"],
        }]
    };

    const errorRateData = {
        labels: ["Syntax Errors", "Compatibility Issues", "Performance Bottlenecks"],
        datasets: [{
            label: "Error Types Frequency",
            data: [10, 5, 3],
            backgroundColor: ["rgba(255, 205, 86, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(201, 203, 207, 0.6)"],
        }]
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h2>📊 Code Migration Analytics</h2>

            {/* Summary Cards with Flip Effect */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "space-around" }}>
                {summaryMetrics.map((metric, index) => (
                    <div key={index} style={{
                        background: `linear-gradient(to right, ${index % 2 === 0 ? "#007bff, #00c6ff" : "#007bff, #00c6ff"})`,
                        color: "white", padding: "20px", borderRadius: "10px", width: "15%", textAlign: "center",
                        fontSize: "18px", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        transition: "transform 0.3s", cursor: "pointer", perspective: "1000px"
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                        {metric.icon}
                        <div style={{ fontSize: "20px", marginTop: "5px" }}>{metric.title}</div>
                        <div style={{ fontSize: "24px", marginTop: "5px", fontWeight: "bold" }}>{metric.value}</div>
                        <p style={{ fontSize: "14px", }}>{metric.description}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            {isExpanded && (
                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: "1" }}>
                        <h3>Migration Success Rate</h3>
                        <Bar data={migrationSuccessData} options={{ responsive: true }} />
                    </div>
                    <div style={{ flex: "1", maxWidth: "250px", height: "250px" }}>
                        <h3>Code Optimization Impact</h3>
                        <Pie data={codeOptimizationData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                    <div style={{ flex: "1" }}>
                        <h3>Common Migration Errors</h3>
                        <Bar data={errorRateData} options={{ responsive: true }} />
                    </div>
                </div>
            )}

            {/* Tabular Data */}
            <h3>📋 Migration Details</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr style={{ background: "#007bff", color: "white" }}>
                        <th>Project</th>
                        <th>Code Lines</th>
                        <th>Success Rate</th>
                        <th>Issues Found</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={index} style={{ background: index % 2 === 0 ? "#f8f9fa" : "#ffffff" }}>
                            <td>{item.project}</td>
                            <td>{item.lines}</td>
                            <td>{item.success}</td>
                            <td>{item.issues}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnalyticsDashboard;
