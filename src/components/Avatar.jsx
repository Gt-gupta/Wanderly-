import React from "react";
import "../App.css"

function Avatar(props) {
    return (
        <>
            <img
                className="avatar-circle"
                src={props.img}
                alt="profile icon"
                style={{ width: `${props.size}px`, height: `${props.size}px` }}  // Append 'px' to the size
            />
        </>
    );
}

export default Avatar;
