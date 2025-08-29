import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./signIn.css"
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;


function SignIn({ login }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (name,e) => {
        if(name==="email"){
            setFormData({...formData , email : e.target.value });
        }else 
        setFormData({ ...formData, password: e.target.value });
    };

    const navigate = useNavigate();

    const handleForgot = async () => {
        if (!formData.email.endsWith("@iitg.ac.in")) {
            alert("Only IITG email addresses are allowed.");
            return; 
        }
        try {
            const response = await axios.post(`http://localhost:5000/auth/forgotPassword`, {
                email: formData.email, 
            });
            alert(response.data.message || "Password reset email sent successfully.");
        } catch (err) {
            console.error("Error during Forgot:", err.response?.data || err.message);
            alert(err.response?.data.message || "Failed to send password reset email.");
        }
    };
    

    const handleButtonClick = async(e) => {
        e.preventDefault();
        try {
            
            const response = await axios.post(`http://localhost:5000/auth/login`, formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username',response.data.name);
            localStorage.setItem('userId',response.data.userId);
            navigate('/');
        } catch (error) {
            console.error('Error during Login:', error.response.data);
        }
        
    }
    

    return (
        <div style={{ display: "flex", height: "100vh" , width:"100%" }}>
            <img src="/campus.jpg" className="image" alt="Campus background" />
            <div className="signIn">
                <p style={{ fontSize: 25, color: "white", textAlign: "center" }}>
                    Sign in to Campus Talks
                </p>
                <input
                className="input"
                placeholder="Email"
                spellCheck="false"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange('email',e)}
            />
            <input
                className="input"
                placeholder={"Password"}
                spellCheck="false"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange('password',e)}
            />

                <button onClick={handleButtonClick} className="signInButton">
                    Sign In
                </button>
                <div className="line"></div>
                <div>
                    <p onClick={handleForgot} style={{color: "#61dafb", cursor: "pointer"}}>Forgot Password</p>
                </div>
                <p style={{ color: "white", textAlign: "center" }}>
                    Don't have an account?{" "}
                    <span
                        style={{ color: "#61dafb", cursor: "pointer" }}
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>

            </div>
        </div>
    );
}

export default SignIn;
