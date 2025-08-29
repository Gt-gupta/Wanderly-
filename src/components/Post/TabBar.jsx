import React, { useState } from "react";
import "../Center.css";

function TabBar(upper) {

    function CustomButton(props) {
        return (
            <div className="custom-button" style={{backgroundColor: upper.type === props.id ? "blue" : "white", cursor:"pointer"}}>
                <p
                    onClick={() => upper.selectType(props.id)}
                    style={{
                        fontSize: 20,
                        color : upper.type===props.id ? "white" : "black"
                    }}
                >
                    {props.text}
                </p>
            </div>
        );
    }

    return (
        <div className="Choice">
            <CustomButton text="Feed" id={0} /> 
            <CustomButton text="Poll" id={1} /> 
        </div>
    );
}

export default TabBar;
