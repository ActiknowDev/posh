import { useEffect, useState } from "react";
import { loadEmployee, loginUser, saveUsers } from "../services/user";

export default function Landing({ onLoginSuccess, onChangeSession, showToast}) {
    const params = new URLSearchParams(window.location.search);
    const employeeId = params.get("employeeId");

    const [exists, setExists] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log("landing page usersession", user)
        const getEmployee = async () => {
            try {
                const res = await loadEmployee(employeeId);
                if (res.data.exists) {
                    console.log("if===",res.data)
                    setExists(true);
                    setUser(res.data.data);
                } else {
                    console.log("else===",res.data)
                    setExists(false);
                    // We only know employeeId for now.
                    // We'll use it while creating the record.
                    // setUser({ employeeId });
                    setUser(res.data.data);
                }
            } catch (err) {
                showToast?.( err.response?.data?.message || "Unable to load employee." );
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) {
            getEmployee();
        }
    }, [employeeId]);
     useEffect(() => {
        

        console.log("asdfasdf")
    }, [exists]);

    const handleContinue = async () => {
        try {
            const res = await loginUser({ email: user.email, employeeId: user.employeeId });
            onChangeSession({
                ...res.data.data,
                isRegistered: true,
                isUserLogin: true,
                quizAnswers: {}
            });
            onLoginSuccess();
        } catch (err) {
            showToast?.( err.response?.data?.message || "Login Failed" );
        }
    };
    const handleSignup = async () => {
        try {
            const res = await saveUsers({
                ...user,
                isRegistered: true,
                isUserLogin: true,
            });
            const savedUser = res.data.data;
            onChangeSession({
                ...savedUser,
                isRegistered: true,
                isUserLogin: true,
                mustRetakeTraining: true,                
                quizAnswers: {},
            });
            onLoginSuccess();
        } catch (err) {
            showToast?.( err.response?.data?.message || "Unable to enroll. Please try again." );
        }
    };
    if (loading) {
        return ( <div className="min-h-screen flex justify-center items-center"> Loading... </div> );
    }
    if (!user) {
        return ( <div className="min-h-screen flex justify-center items-center"> Employee not found. </div> );
    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-100">
            <div className="bg-white w-[500px] rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-3">  POSH Training </h2>
                {loading ? ( <p className="text-center">Loading...</p> ) : exists ? (
                    <>
                        <p className="text-center mb-6"> Welcome back <strong>{user.name}</strong>. </p>
                        <button onClick={handleContinue} className="w-full bg-[#800000] text-white rounded-lg p-3" >
                            Continue Training
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-center mb-6"> Welcome <b>{user.name}</b>! </p>
                        <p className="text-center text-gray-600 mb-6">
                            We couldn't find any previous POSH training record.
                        </p>
                        <button onClick={handleSignup} className="w-full bg-[#800000] text-white rounded-lg p-3" >
                            Start POSH Training
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}