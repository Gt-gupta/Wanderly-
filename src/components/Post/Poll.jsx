import React, { useState } from "react";

function Poll({ list, onOptionChange, onOptionAdd, onOptionDelete }) {
    const inputStyle = {
        height: 40,
        width: 500,
        borderRadius: 20,
        paddingLeft: 10,
        border: "none",
        marginBottom: 10,
        fontSize: 20,
    };

    return (
        <div style={{ display: "block" }}>
            {list.map((option, index) => (
                <div
                    key={option.id}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <input
                        placeholder="Enter Option"
                        type="text"
                        style={inputStyle}
                        value={option.value}
                        onChange={(e) => onOptionChange(index, e.target.value)}
                    />
                    <img
                        src="/cancel.png"
                        alt="Delete"
                        style={{ cursor: "pointer" }}
                        height={30}
                        width={30}
                        onClick={() => onOptionDelete(index)}
                    />
                </div>
            ))}
            {list.length < 4 && (
                <p
                    onClick={onOptionAdd}
                    style={{
                        backgroundColor: "black",
                        height: 30,
                        width: 150,
                        borderRadius: 20,
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    Add Option
                </p>
            )}
        </div>
    );
}

export default Poll;