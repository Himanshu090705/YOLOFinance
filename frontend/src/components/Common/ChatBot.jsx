import { useState } from "react";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi! How can I help you today?" },
    ]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { from: "user", text: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        try {
            const response = await fetch("http://localhost:4000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
        } catch (error) {
            console.error("Error fetching bot reply:", error);
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: "Oops! Something went wrong." },
            ]);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 2147483647,
            }}
        >
            {isOpen ? (
                <div
                    style={{
                        width: 320,
                        height: 400,
                        background: "white",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        border: "2px solid #1b1b1b",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            background: "#1b1b1b",
                            color: "white",
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: "16px" }}>Chatbot</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: "white",
                                color: "#1b1b1b",
                                border: "none",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            padding: "10px",
                            overflowY: "auto",
                            fontSize: "14px",
                        }}
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    marginBottom: "8px",
                                    padding: "6px 10px",
                                    borderRadius: "8px",
                                    maxWidth: "70%",
                                    background:
                                        msg.from === "user"
                                            ? "#1b1b1b"
                                            : "#e5e7eb",
                                    color:
                                        msg.from === "user" ? "white" : "black",
                                    marginLeft:
                                        msg.from === "user" ? "auto" : "0",
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            display: "flex",
                            borderTop: "1px solid #ddd",
                            padding: "8px",
                            gap: "8px",
                        }}
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                fontSize: "14px",
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                background: "#1b1b1b",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 12px",
                                cursor: "pointer",
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "#1b1b1b",
                        color: "white",
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    }}
                >
                    Chat
                </button>
            )}
        </div>
    );
}
