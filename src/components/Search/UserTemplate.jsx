import React from "react";
import Avatar from "../Avatar";
function UserTemplate(props){
    const styling = {
        display: "flex",
        backgroundColor: "pink",
        borderRadius: 25,
        alignItems: "center",
        padding: "10px 10px 20px",
        height: 60,
        marginTop: 20,
        position: "relative",
        justifyContent: "space-between",
    };

    const add = {
        backgroundColor: "green",
        height: 40,
        width: 100,
        borderRadius: 20,
        color: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 30,
    };
    const remove = {
        ... add,
        backgroundColor: "red",
    };

    const profile = {
        backgroundColor: "blue",
        height: 40,
        width: 100,
        borderRadius: 20,
        color: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 30,
    };

    return (
        <div style={styling}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar img="/male_avatar.jpg" size={60} />
                <p style={{ marginLeft: 20, fontSize: 22 }}>{props.name}</p>
                {props.friend ? <p style={remove} onClick={()=>props.handleDelete(props.id)}>Remove</p> : <p style={add} onClick={()=>{props.addFriend(props.id)}}>Add</p>}
                <p  style={profile}>Profile</p>
            </div>
        </div>
    );
}

export default UserTemplate;