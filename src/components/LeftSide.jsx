import React from "react";
import ProfileIcon from "./ProfileIcon";
import Pages from "./Pages";
import '../App.css';
import { useNavigate } from "react-router-dom";


function LeftSide(props) {
    const navigate = useNavigate();
    const id = localStorage.getItem("userId");
    function profileScreen(){
        navigate(`/profile/${id}`);
    }
    return <div className="Left-side">
        <ProfileIcon />
        <div style={{cursor:"pointer"}} onClick={()=>profileScreen()}>
            <h2>{props.name}</h2>
        </div>

        <Pages update={props.update} />
    </div>
}

export default LeftSide;