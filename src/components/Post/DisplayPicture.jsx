import React from "react";

function DisplayPicture(props) {
    const imageStyle = {
        height: 300,
        width: 500,
        objectFit: 'cover'
    };

    return (
        <img src={props.pic} alt="" className="display-pic" style={imageStyle} />
    );
}

export default DisplayPicture;
