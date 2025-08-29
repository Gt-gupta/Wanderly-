import React, { useState } from "react";
import "../Center.css";
import DisplayPicture from "./DisplayPicture";

function Pictures({ onImageChange }) {
    const [pic, setPic] = useState(null);

    // Handle file selection
    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setPic(URL.createObjectURL(file)); // Preview the image
            onImageChange(file); // Pass the image file back to the parent
        }
    }

    return (
        <div>
            {/* If no picture is uploaded, show the file upload input */}
            {pic === null ? (
                <div className="custom-file-input">
                    <label htmlFor="fileUpload">Upload File</label>
                    <input
                        type="file"
                        id="fileUpload"
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                <div className="custom-image">
                    <DisplayPicture pic={pic} /> {/* Display the selected image */}
                </div>
            )}
        </div>
    );
}

export default Pictures;
