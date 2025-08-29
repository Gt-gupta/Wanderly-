import React from "react";
import { useNavigate } from 'react-router-dom';
import '../App.css';

function PagesFrame(props) {
    const navigate = useNavigate(); // Initialize navigate

    function handleButtonClick() {
        localStorage.removeItem('token');
        navigate('/signIn'); // Redirect to the target path
    }
    return (
        <div 
            onClick={() => {props.selectIndex(props.index) ; props.update(props.index); props.index===4&&handleButtonClick() ;}} 
            className="Page-box" 
            style={{ backgroundColor: props.chosenIndex === props.index ? "black" : "white" , cursor:"pointer" }}
        >
            <img src={props.img} alt="Page" height={20} width={20} style={{objectFit:"contain"}} />
            <p style={{
                color: props.index===4 ? "red" : props.chosenIndex === props.index ? "white" : "black",
                fontWeight: 500,
                fontSize:19
            }}>
                {props.name}
            </p>
        </div>
    );
}

export default PagesFrame;
