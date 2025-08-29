import React, { useState } from "react";
import axios from 'axios';
import "../../App.css";
import "../Center.css";
import { useNavigate } from 'react-router-dom';
import Button from "./Button";
import PostDescription from "./PostDescription"; 
import TabBar from "./TabBar";
import Pictures from "./Pictures";
import Poll from "./Poll";

function Post() {
    const [type, setType] = useState(0); 
    const [formData, setFormData] = useState({ description: '' });
    const [image, setImage] = useState(null);
    const [list, setList] = useState(["",""]);

    function addOptions() {
        if (list.length < 4) {
            setList([...list, { id: Date.now(), value: "" }]); // Add a new option with a unique ID
        }
    }

    function deleteOptions(index) {
        setList(list.filter((_, i) => i !== index));
    }

    function handleInputChange(index, value) {
        const newList = [...list];
        newList[index] = value;
        setList(newList);
    }


    function selectType(no) {
        setType(no);
    }
    const navigate = useNavigate();

    // Handle the form data input
    const handleDescriptionChange = (e) => {
        setFormData({
            ...formData,
            description: e.target.value
        });
    };

    // Handle file change (image upload)
    const handleImageChange = (imageFile) => {
        setImage(imageFile);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('description', formData.description);
        if (image) data.append('image', image);
        console.log("inside it");

        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.post('http://localhost:5000/post/createPost', data, {
                headers: { 'Content-Type': 'multipart/form-data' , 'Authorization': `Bearer ${token}`  },
            });
            console.log('Post created:', response.data);
            navigate(0);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handlePoll = async (e) => {
        e.preventDefault();
    
        const data = {
            description: formData.description,
            options: list
        };
    
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.post('http://localhost:5000/post/createPoll', data, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            console.log('Poll created:', response.data);
            navigate(0);
        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };
    

    return (
        <div className="Post">
            <TabBar selectType={selectType} type={type} />
            <div className="post">
                <PostDescription t={type} description={formData.description} onDescriptionChange={handleDescriptionChange} />
                <div className="post-body">
                    {type === 0 ? <Pictures onImageChange={handleImageChange} /> : <Poll list={list} onOptionChange={handleInputChange} onOptionAdd={addOptions} onOptionDelete={deleteOptions} />}
                </div>
            </div>
            <Button text="Post" handleSubmit={type==0 ? handleSubmit : handlePoll} />
        </div>
    );
}

export default Post;
