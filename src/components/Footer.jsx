import React from "react";
import "./Center.css"
function Footer(props) {
    return (
        <div className="footer">
            <div style={{ marginRight: 20, display: "flex" }}>
                <div onClick={() => { props.postLike(props.id); }}>
                    <img src={props.image} alt="heart_icon" height={50} width={50} style={{ cursor: "pointer", paddingTop:10 }} />
                </div>
                <p style={{ color: "white", paddingRight: 10, fontSize: 20 }}>{props.likes}</p>

            </div>
        </div>
    );
}

export default Footer;