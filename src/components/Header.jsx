import React from "react";
import Avatar from "./Avatar";
import "./Center.css"

function Header(props) {
    return (
        <div className="header">
            <Avatar img="/male_avatar.jpg" size={40} />
            <p style={{ marginLeft: 20, fontSize: 18 , fontWeight: "bold" }}>{props.name}</p>
        </div>
    );
}

export default Header;