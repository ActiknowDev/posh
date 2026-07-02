import { useState } from "react";
import {loginUser} from "../services/user";

export default function Login({
    onLoginSuccess,
    goToSignup,
    onChangeSession
}) {

    const [form, setForm] = useState({
        email: "",
        employeeId: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(form);
            // console.log(res.data);
            onChangeSession({
                ...res.data.data,
                isRegistered: true,
                isUserLogin: res.data.data.isUserLogin || true
            });
            onLoginSuccess();

        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-100">
            <div className="bg-white w-[420px] rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-lg p-3"
                        value={form.email}
                        onChange={(e)=>setForm({...form,email:e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder="Employee ID"
                        className="w-full border rounded-lg p-3"
                        value={form.employeeId}
                        onChange={(e)=>setForm({...form,employeeId:e.target.value})}
                    />
                    <button className="w-full bg-[#800000] text-white rounded-lg p-3" >
                        Login
                    </button>

                </form>

                <div className="text-center mt-4">
                    <span>New User? </span>
                    <button
                        type="button"
                        onClick={goToSignup}
                        className="text-[#800000] font-bold underline cursor-pointer"
                    >
                        Signup
                    </button>

                </div>

            </div>

        </div>

    );

}