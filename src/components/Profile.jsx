import React, { useEffect, useState } from "react";
import "./profile.css";
import Avatar from "./Avatar";
import PostTemplate from "./PostTemplate";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProfileScreen(){
    const [posts,setPosts] = useState([]);
    const {id} = useParams();
    useEffect(()=>{
        const fetchPosts = async() => {
            const token = localStorage.getItem("token");
            try{
                const response = await axios.get(`http://localhost:5000/get/getProfilePosts`,{
                    headers : {Authorization : `Bearer ${token}`},
                    params : {id:id}
                });
                setPosts(response.data.data);
                console.log(response.data.data);
            }catch(err){
                console.log("error getting posts "+err);
            }
        };
        fetchPosts();
    },[id]);

    return (
        <div style={{display:"flex"}}>
            <div className="about">
                <Avatar img='/male_avatar.jpg' size={250}/>
                <p style={{fontSize:25, fontWeight:"bold"}}>{id}</p>
                <p style={{fontSize:22, fontWeight:"500"}}>23 Friends</p>
                <p style={{fontSize:22, fontWeight:"500"}}>10 Posts</p>
            </div>
            <div className="posts" style={{marginLeft:20 , marginRight:20}}>
            {posts.map(post=>{
            return <PostTemplate name={post.userId} text={post.description} likes={post.likes} imagePath={post.image_path} likedByYou={post.likedByYou} id={post.id} /> ;
        })}
            </div>
        </div>
    );
}

export default ProfileScreen;