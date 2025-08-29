import React from "react";
import "./RightSide.css"

function StoryTemplate(props){
    return (
        <div className="story">
            <p>{props.text}</p>
        </div>
    );
}

export default StoryTemplate;