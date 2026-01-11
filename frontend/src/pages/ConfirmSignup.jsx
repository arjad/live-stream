import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const name = location.state?.name || "";
  const [message, setMessage] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/confirm", {
        name,
        code,
      });
      setMessage("✅ Confirmation successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.response?.data?.message || "Confirmation failed"));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Confirm Signup</h2>
      <p>name: {name}</p>
      <form onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Confirm
        </button>
      </form>
      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
};

export default ConfirmSignup;
