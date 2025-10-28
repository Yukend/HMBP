import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("🧭 No token — redirecting to signup/login");
        navigate("/auth");
        return;
    }

    const checkAuth = async () => {
        try {
        const res = await fetch("http://localhost:8000/auth/me", {
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            const user = await res.json();
            console.log("✅ Authenticated user:", user);

            // if first-time user with no profile details
            if (!user.username || !user.date_of_birth) {
            console.log("🧭 First-time user — redirect to details form");
            navigate("/user-details");
            } else {
            navigate("/");
            }
        } else if (res.status === 401) {
            console.warn("🚫 Not authenticated, redirecting to login");
            localStorage.removeItem("token");
            navigate("/auth");
        }
        } catch (error) {
        console.error("❌ Error checking auth:", error);
        }
    };

    checkAuth();
    }, [navigate]);


  return null;
};

export default AuthChecker;
