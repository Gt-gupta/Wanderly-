import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import "./Center.css"

function PostTemplate(props){
    const [isLiked,setLike] = useState(props.likedByYou);
    const [countLikes , setCount] = useState(props.likes);

    const imageStyle = {
        maxWidth: "100%",
        borderRadius: "10px",
        marginTop: "10px",
    };
    const handleLike = async (id) => {
        console.log("in post Like");
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage
            if (!token) {
                throw new Error("User is not authenticated");
            }
    
            // Make the POST request
            const response = await axios.post(
                "http://localhost:5000/post/postLike",
                { id }, // Payload data
                { headers: { Authorization: `Bearer ${token}` } } // Headers
            );
            setLike(!isLiked);
            if(isLiked)setCount(countLikes-1);
            else setCount(countLikes+1);
    
            console.log("Like added successfully", response.data);
        } catch (err) {
            console.error("Error in handleLike:", err.message || err.response?.data?.message);
        }
    };
    
    return(
    <div className="template">
        <Header name={props.name} />
        <p style={{ textAlign: 'left' , fontWeight:600}}>{props.text}</p>
        {props.imagePath && (
    <img 
        src={`http://localhost:5000${props.imagePath}`} 
        alt="Post" 
        style={{
            maxWidth: '100%', 
            maxHeight: '400px', 
            objectFit: 'cover', // Optional: Makes sure the image covers the area without stretching
            borderRadius: '8px', // Optional: Gives rounded corners to the image
            justifyContent:"center"
        }} 
    />
)}
        <Footer likes={countLikes} image={isLiked ? "/heart.png":"/heart_empty.png"  } postLike={handleLike} id={props.id} />
    </div>
    );
}

export default PostTemplate;