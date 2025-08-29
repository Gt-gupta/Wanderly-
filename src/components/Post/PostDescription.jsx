import React from "react";
import "../Center.css";

function PostDescription({ t, description, onDescriptionChange }) {
    return (
        <div className="textInput">
            <textarea
                className="custom-textarea"
                rows="2" 
                placeholder={t === 0 ? "Enter your text here..." : "Enter your poll here"}
                maxLength={150}
                spellCheck={false}
                value={description}
                onChange={onDescriptionChange} // Bind to the parent's state change handler
            />
        </div>
    );
}

export default PostDescription;
