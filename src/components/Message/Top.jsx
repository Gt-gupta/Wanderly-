import React from "react";
import Avatar from "../Avatar";
function Top(props) {
    const styling = {
        backgroundColor: "blue",
        height: "10vh",
        width: "100%",
        display:"flex"
    };
    return (
        <div style={styling}>
            <div style={{marginLeft:20 , paddingBottom:20}}><Avatar img="/male_avatar.jpg" size="50" /></div>
            <h1 style={{ color: "white", margin: 0, padding: "10px" , paddingTop:"20px" }}>{props.name}</h1>
        </div>
    );
}

export default Top;