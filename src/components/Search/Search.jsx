import React, { useEffect, useState } from "react";
import './search.css';
import '../../App.css';
import SearchBar from "./SearchBar";
import axios from "axios";
import UserTemplate from "./UserTemplate";

function Search(){
    const [users,setUsers] = useState([]);
    const [search,setSearch] = useState("");

    const handleChange = async (e) => {
        const searchValue = e.target.value;
        setSearch(searchValue); // Update search state
        const token = localStorage.getItem("token"); // Get the token from localStorage
    
        if (!token) {
            console.error("User is not authenticated");
            return;
        }
    
        try {
            // Use query parameters to send username for a GET request
            const response = await axios.get("http://localhost:5000/get/getUsers", {
                headers: { Authorization: `Bearer ${token}` },
                params: { username: searchValue }, // Send username as a query parameter
            });
    
            console.log("Got users:", response.data.data);
            setUsers(response.data.data); // Update users state with the fetched data
            console.log(users);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleDelete = async (userId) => {
        const token = localStorage.getItem("token"); // Get the token from localStorage
    
        if (!token) {
            throw new Error("User is not authenticated");
        }
    
        try {
            const response = await axios.delete("http://localhost:5000/delete/deleteFriend", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    id2: userId, // Pass the userId in the data payload
                },
            });
    
            console.log("Friend deleted successfully", response);
    
            // Update the state to mark the user as not a friend
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, friend: false } : user
                )
            );
        } catch (error) {
            console.error("Error deleting friend:", error);
        }
    };
    

    const addFriend = async (userId) => {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        if (!token) {
            throw new Error("User is not authenticated");
        }
        
        try {
            const response = await axios.post(
                "http://localhost:5000/post/createFriend",
                 {id2 : userId},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log("Friend added successfully", response);
    
            // Update the state to mark the user as a friend
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, friend: true } : user
                )
            );
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };
    

    


    return <div className="search">
        <SearchBar handleChange={handleChange} />
        {users.length!=0 ? users.map((user) => (
            <UserTemplate name={user.username} friend={user.friend} handleDelete={handleDelete} id={user.id} addFriend={addFriend} />
        )) : <div>
                <img src="/users.png" alt="users" height={"30%"} width={"30%"} style={{marginTop:"10%"}} />
                <p style={{fontSize:25 , fontWeight:"bold"}}>Search your fellow Users!!</p>
            </div>}
    </div>
}

export default Search;