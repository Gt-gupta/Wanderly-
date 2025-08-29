import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import Top from "./Top";
import Bottom from "./Bottom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import './messages.css';

function Messages() {
    const { id } = useParams();
    const [chatId, setChatId] = useState(0);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Not Authenticated");
            return;
        }

        const fetchChatData = async () => {
            try {
                // Step 1: Retrieve chatId
                const chatIdResponse = await axios.get(`http://localhost:5000/get/getChatId`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { id: id }, // `id` from props or state
                });

                const retrievedChatId = chatIdResponse.data.data;
                setChatId(retrievedChatId);

                // Step 2: Use chatId to fetch chats
                const chatResponse = await axios.get(`http://localhost:5000/get/getChat`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { chatId: retrievedChatId },
                });

                setMessages(chatResponse.data.data);
                scrollToBottom(); // Scroll to bottom after loading messages
            } catch (err) {
                console.error("Error fetching chat data:", err);
                alert("Error fetching chat data");
            }
        };

        fetchChatData();
    }, [id]); // Dependency array includes `id`
    const socket = io("http://localhost:5000");
    useEffect(()=>{
        scrollToBottom();
    },[messages]);
    useEffect(() => {
        if (chatId === 0) return;
        console.log(`Joining room: ${chatId}`);
        socket.emit("joinRoom", chatId);

        socket.on("receiveMessage", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.disconnect(); // Cleanup on unmount
        };
    }, [chatId]);

    const sendMessage = async (message) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("User is not authenticated. Please log in.");
            return;
        }

        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                alert("User not authenticated. Please log in.");
                return;
            }

            await axios.post(
                `http://localhost:5000/post/postMessage`,
                { message, id, chatId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Emit the message for real-time communication
            socket.emit("sendMessage", { message, senderId: userId, chatId });
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Error sending message. Please try again.");
        }
    };

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "70vh",
        overflowY: "auto",
        padding: "20px",
        scrollBarWidth : "thin",
        scrollBarColor:"transparent"
    };

    const boxStyleLeft = {
        width: "40%",
        margin: "10px 0",
        padding: "10px",
        backgroundColor: "lightgray",
        borderRadius: "10px",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "flex-start",
    };

    const boxStyleRight = {
        ...boxStyleLeft,
        alignSelf: "flex-end",
        backgroundColor: "lightblue",
    };

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Top name={id} />
            <div className="messages" style={containerStyle}>
                {messages.length > 0
                    ? messages.map((m, index) => (
                        <div
                            key={index}
                            style={
                                m.senderId != id
                                    ? boxStyleRight
                                    : boxStyleLeft
                            }
                        >
                            {m.message}
                        </div>
                    ))
                    : <p>What are you waiting for? Start your First Chat with {id}</p>}
                <div ref={messagesEndRef} />
            </div>
            <div onClick={() => scrollToBottom()} className="bottom"><img src="/downArrow.png" alt="down" height={30} width={30} /></div>
            <Bottom sendMessage={sendMessage} />
        </div>
    );
}

export default Messages;
