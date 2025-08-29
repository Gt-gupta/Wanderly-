import React,{useState} from "react";

function Bottom(props) {
    const [sentMessage, setSentMessage] = useState(''); // State to control visibility of "Message Sent"

    const inputStyle = {
        color: "white",
        spellCheck: "false",
        backgroundColor: "blue",
        height: 40,
        width: 500,
        borderRadius: 20,
        paddingLeft: 10,
        border: "none",
        marginBottom: 10,
        fontSize: 20,
    };

    const containerStyle = {
        height:"10vh",
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
    };

    const imgStyle = {
        height: "50px",
        width: "50px",
        cursor: "pointer",
        marginLeft: 10,
    };

    return (
        <div style={containerStyle}>
            <input
                style={inputStyle}
                placeholder="Type your message..."
                value={sentMessage}
                onChange={(e) => setSentMessage(e.target.value)} // Update sent message dynamically
            />
            <div>
                <img
                    onClick={()=>{
                        if(sentMessage.trim()!=''){
                            props.sendMessage(sentMessage);
                            setSentMessage("");
                        }
                    }}
                    style={imgStyle}
                    src="/send.png"
                    alt="Send"
                />
            </div>
        </div>
    );
};

export default Bottom;