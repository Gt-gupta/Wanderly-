import React from "react";
import '../App.css';
import StoryTemplate from "./StoryTemplate";


function RightSide(props){
    return <div className = "Right-side">
        <h2>Top Story of the Month</h2>
        {props.topPosts.length > 0 ? props.topPosts.map(x => (
            <StoryTemplate text={x.description} />   
        )) : <p>No TOP Story for this month</p>}
    </div>
}

export default RightSide;