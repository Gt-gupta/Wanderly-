import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the token from the query string
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    // Form states
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/auth/resetPassword", {
                token,
                newPassword,
            });

            setSuccess(response.data.message || "Password reset successful.");
            // Redirect to login after a delay
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error("Error resetting password:", err.response?.data || err.message);
            setError(err.response?.data.message || "Failed to reset password.");
        }
    };

    return (
        <div className="reset-password-container" style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Reset Password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            {!success && (
                <form onSubmit={handleResetPassword} style={{ maxWidth: "400px", margin: "0 auto" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <label htmlFor="newPassword" style={{ display: "block", marginBottom: "10px" }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "10px" }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Reset Password
                    </button>
                </form>
            )}
        </div>
    );
}

export default ResetPassword;
