import React, { useState, useEffect } from "react";
import Center from './Center';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import Post from './Post/Post';
import Friends from './Friends/Friends';
import Search from "./Search/Search";
import { useSearchParams } from 'react-router-dom';
import "../App.css";
import axios from "axios";

function Home() {
    const [searchParams] = useSearchParams();
    const indexFromParams = parseInt(searchParams.get('index')) || 0; // Ensure index is a number
    const [chosenIndex, setIndex] = useState(indexFromParams); // Set initial state based on query parameter
    const [topPosts,setTopPosts] = useState([]);

    useEffect(() => {
        // Update chosenIndex when the query parameter changes (e.g., after navigating)
        setIndex(indexFromParams);
    }, [indexFromParams]); // Trigger re-render when the indexFromParams changes

    useEffect(() => {
        const token = localStorage.getItem('token');
        const getTopPosts = async() => {
            try{
                const response = await axios.get(`http://localhost:5000/get/getTopPosts`,{
                    headers : {Authorization : `Bearer ${token}`}
                });
                setTopPosts(response.data.data);
                console.log("Got top posts");
            }catch(err){
                console.log("Error getting top posts");
            }
        }
        getTopPosts();
    },[]);

    function update(no) {
        setIndex(no);
    }
    const name = localStorage.getItem("username");

    return (
        <div className="App">
            <LeftSide update={update} name={name} />
            {chosenIndex === 0 && <Center />}
            {chosenIndex === 1 && <Post />}
            {chosenIndex === 2 && <Search />}
            {chosenIndex === 3 && <Friends />}
            <RightSide topPosts={topPosts} />
        </div>
    );
}

export default Home;
