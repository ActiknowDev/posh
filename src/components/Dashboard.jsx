import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getUserByEmail } from "../services/user";

export default function Dashboard({userSession}) {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const res = await getUserByEmail(userSession.email);
        setUsers(res.data.data);

    };

    const columns = [

        {
            name:"Name",
            selector:row=>row.name
        },
        {
            name:"Email",
            selector:row=>row.email
        },
        {
            name:"Employee ID",
            selector:row=>row.employeeId
        },
        {
            name:"Department",
            selector:row=>row.department
        },
        {
            name:"Role",
            selector:row=>row.role
        },
        {
            name:"City",
            selector:row=>row.city
        },
        {
            name:"Quiz",
            selector:row=>row.quizScore
        },
        // {
        //     name:"completed At",
        //     selector:row=>new Date(row.completedAt).toLocaleString()
        // },
        {
            name: "Completed At",
            // selector: row => new Date(row.completedAt).toLocaleString("en-IN")
            selector: row => row.completedAt ? new Date(row.completedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }) : "-"
        },
        {
            name:"Result",
            selector:row=>row.quizScore?(row.quizScore>=4?"Pass":"Fail"):"Not Attempted"
        }

    ];

    return (

        <div className="p-5">

            <DataTable
                title="Training Completion Records"
                columns={columns}
                data={users}
                pagination
                striped
                highlightOnHover
            />

        </div>

    );

}