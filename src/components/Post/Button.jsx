import React from "react";
import "../Center.css";
function Button(props){
    return (
        <div className="button" onClick={
        props.handleSubmit
        }>
            <p style={{fontSize:23 , color:"white" , margin:"auto" , cursor:"pointer"}}>{props.text}</p>
        </div>
    );
}

export default Button;