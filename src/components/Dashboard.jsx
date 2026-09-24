import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { getUserByEmail } from "../services/user";

export default function Dashboard({ userSession }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const res = await getUserByEmail(userSession.email);
            setUsers(res.data.data || []);
        } catch (error) {
            console.error("Failed to load user data:", error);
            setUsers([]);
        }
    };

    const handleExportExcel = () => {
        if (!users || users.length === 0) {
            alert("No training records available to export.");
            return;
        }

        const excelData = users.map((row) => ({
            "Name": row.name || "",
            "Email": row.email || "",
            "Employee ID": row.employeeId ? `COO${row.employeeId}` : "",
            "Designation": row.role || "",
            "City": row.city || "",
            "Quiz Score": `${row.quizScore ?? 0}/5`,
            "Completion Date": formatDateTime(row.completedAt),
            "IP Address": row.ipAddress || "-",
            "Result": row.quizScore
                ? row.quizScore >= 4
                    ? "Pass"
                    : "Fail"
                : "Not Attempted"
        }));
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        // Create workbook
        const workbook = XLSX.utils.book_new();
        // Add worksheet
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Training Records"
        );
        // Set column widths
        worksheet["!cols"] = [
            { wch: 25 }, // Name
            { wch: 30 }, // Email
            { wch: 18 }, // Employee ID
            // { wch: 25 }, // Department
            { wch: 25 }, // Role
            { wch: 18 }, // City
            { wch: 12 }, // Quiz Score
            { wch: 18 }, // Completed At
            { wch: 20 }, // IP Address
            { wch: 18 }  // Result
        ];
        // Download Excel file
        XLSX.writeFile(
            workbook,
            `Training_Completion_Records_${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`
        );
    };

    const formatDateTime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";
        const pad = (num) => String(num).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const columns = [
    {
        name: "Name",
        selector: row => row.name,
        cell: row => ( <span title={row.name || ""} className="truncate"> {row.name || "-"} </span> )
    },
    {
        name: "Email",
        selector: row => row.email,
        cell: row => ( <span title={row.email || ""} className="truncate" style={{ maxWidth: "250px" }} > {row.email || "-"} </span> )
    },
    {
        name: "Employee ID",
        selector: row => row.employeeId,
        cell: row => (  
            <span title={row.employeeId ? `COO${row.employeeId}` : ""}>
                {row.employeeId ? `COO${row.employeeId}` : "-"}
            </span>
        )
    },
    {
        name: "Designation",
        selector: row => row.role,
        cell: row => ( <span title={row.role || ""} className="truncate" > {row.role || "-"} </span> )
    },
    {
        name: "City",
        selector: row => row.city,
        cell: row => ( <span title={row.city || ""} className="truncate" > {row.city || "-"} </span> )
    },
    {
        name: "Test Score",
        selector: row => row.quizScore,
        cell: row => (  
            <span title={row.quizScore != null ? `${row.quizScore}/5` : ""}> 
                {row.quizScore != null ? `${row.quizScore}/5` : "-"} 
            </span> )
    },
    {
        name: "Completed At",
        selector: row => row.completedAt,
        cell: row => ( <span title={formatDateTime(row.completedAt) || ""}> {row.completedAt ? formatDateTime(row.completedAt) : "-"} </span> )
    },
    {
        name: "IP Address",
        selector: row => row.ipAddress,
        cell: row => ( <span title={row.ipAddress || ""}> {row.ipAddress || "-"} </span> )
    },
    {
        name: "Result",
        selector: row => row.quizScore,
        cell: row => (
            <span title={ row.quizScore ? row.quizScore >= 4 ? "Pass" : "Fail" : "Not Attempted" } >
                {row.quizScore
                    ? row.quizScore >= 4
                        ? "Pass"
                        : "Fail"
                    : "Not Attempted"}
            </span>
        )
    }
];

    return (
        <div className="p-5">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    Training Completion Records
                </h2>

                <button
                    onClick={handleExportExcel}
                    disabled={!users.length}
                    // className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded flex items-center gap-2"
                    className="px-4 py-2.5 bg-accent hover:bg-accent/90 text-white font-extrabold text-xs rounded-none flex items-center gap-1.5 transition shadow-lg cursor-pointer uppercase tracking-wider"
                >
                    <span>↓</span>
                    Export Excel
                </button>
            </div>

            <DataTable
                // title="Training Completion Records"
                columns={columns}
                data={users}
                pagination
                striped
                highlightOnHover
            />

        </div>
    );
}