"use client";

import { useState } from "react";

export default function Page() {
    const [emailData, setEmailData] = useState({
        to: "",
        subject: "",
        text: "",
    });
    const [status, setStatus] = useState("");

    const sendEmail = async () => {
        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(emailData),
            });
    
            const text = await response.text(); // Get response as text
    
            try {
                const result = JSON.parse(text); // Try to parse the response as JSON
                if (result.success) {
                    setStatus("Email sent successfully!");
                } else {
                    setStatus(`Error: ${result.error}`);
                }
            } catch (parseError) {
                setStatus(`Error: Unable to parse response - ${text}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setStatus(`Error: ${error.message}`);
            } else {
                setStatus("An unknown error occurred.");
            }
        }
    };

    return (
        <div style={{ 
            fontFamily: "Arial, sans-serif", 
            backgroundColor: "#f7f7f7", 
            padding: "30px", 
            borderRadius: "10px", 
            maxWidth: "600px", 
            margin: "auto", 
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" 
        }}>
            <h1 style={{ 
                textAlign: "center", 
                color: "#333", 
                fontSize: "2rem", 
                marginBottom: "20px" 
            }}>Send an Email</h1>
            
            <input
                type="email"
                placeholder="Recipient's Email"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                style={{
                    width: "100%", 
                    padding: "10px", 
                    marginBottom: "15px", 
                    borderRadius: "5px", 
                    border: "1px solid #ddd", 
                    fontSize: "1rem"
                }}
            />
            
            <input
                type="text"
                placeholder="Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                style={{
                    width: "100%", 
                    padding: "10px", 
                    marginBottom: "15px", 
                    borderRadius: "5px", 
                    border: "1px solid #ddd", 
                    fontSize: "1rem"
                }}
            />
            
            <textarea
                placeholder="Message"
                value={emailData.text}
                onChange={(e) => setEmailData({ ...emailData, text: e.target.value })}
                style={{
                    width: "100%", 
                    padding: "10px", 
                    height: "150px", 
                    marginBottom: "20px", 
                    borderRadius: "5px", 
                    border: "1px solid #ddd", 
                    fontSize: "1rem", 
                    resize: "none"
                }}
            ></textarea>
            
            <button
                onClick={sendEmail}
                style={{
                    width: "100%", 
                    padding: "10px", 
                    backgroundColor: "#007bff", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "5px", 
                    fontSize: "1.1rem", 
                    cursor: "pointer", 
                    transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
            >
                Send Email
            </button>
            
            <p style={{
                textAlign: "center", 
                marginTop: "20px", 
                color: status.includes("Error") ? "red" : "green", 
                fontSize: "1rem"
            }}>
                {status}
            </p>
        </div>
    );
}
