import React, { useState } from "react";
import axios from "axios";
import "../../App.css";
import "../Center.css";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import PostDescription from "./PostDescription";
import TabBar from "./TabBar";
import Pictures from "./Pictures";
import Poll from "./Poll";

function Post() {
  const [type, setType] = useState(0); // 0 = photo/text post, 1 = poll/trip pool (assuming)
  const [formData, setFormData] = useState({ description: "" });
  const [image, setImage] = useState(null);

  // Trip-pool / poll state (controlled)
  const [location, setLocation] = useState("");
  const [no, setNo] = useState(""); // keep as string in input; convert on submit
  const [going, setGoing] = useState("");


  const navigate = useNavigate();

  const selectType = (val) => setType(val);

  // ----- Standard post (image + description)
  const handleDescriptionChange = (e) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleImageChange = (imageFile) => setImage(imageFile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("description", formData.description);
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/post/createPost",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Post created:", response.data);
      navigate(0);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // ----- Poll / Trip Pool submit
  const handlePoll = async (e) => {
    e.preventDefault();

    console.log("Submitting poll with:", { location, no, going });

    // basic validation (optional)
    const payload = {
      location: (location || "").trim(),
      no: Number(no) || 0,
      going, // YYYY-MM-DD
    };
    if(!payload.location || payload.no <= 0 || !payload.going) {
      alert("Please fill all fields correctly.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/post/createPool",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Poll created:", response.data);
      navigate(0);
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div className="Post">
      <TabBar selectType={selectType} type={type} />

      <div className="post">
        {type === 0 && (
          <PostDescription
            t={type}
            description={formData.description}
            onDescriptionChange={handleDescriptionChange}
          />
        )}

        <div className="post-body">
          {type === 0 ? (
            <Pictures onImageChange={handleImageChange} />
          ) : (
            <Poll
              location={location}
              no={no}
              going={going}
              onLocationChange={setLocation}
              onNoChange={setNo}
              onGoingChange={setGoing}
            />
          )}
        </div>
      </div>

      <Button text="Post" handleSubmit={type === 0 ? handleSubmit : handlePoll} />
    </div>
  );
}

export default Post;
