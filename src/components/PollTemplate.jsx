import React, { useState } from "react";
import Header from "./Header";
import "./Center.css"
import axios from "axios";

function PollTemplate(props) {
    const opt1 = props.opt1;
    const opt2 = props.opt2;
    const opt3 = props.opt3;
    const opt4 = props.opt4;
    const [counts, setCounts] = useState([props.c1, props.c2, props.c3, props.c4]);
    const [total, setTotal] = useState(props.c1 + props.c2 + props.c3 + props.c4);
    const [no, setNo] = useState(props.no);
    function DisplayOption({ option, ind, id }) {
        const percentage = total > 0 ? counts[ind] / total * 100 : 0;
        const handlePoll = async () => {
            const token = localStorage.getItem("token"); // Get the token from localStorage
            if (!token) {
                throw new Error("User is not authenticated");
            }

            try {
                const response = await axios.post(
                    "http://localhost:5000/post/postOpinion",
                    { id, ind }, // Payload data
                    { headers: { Authorization: `Bearer ${token}` } } // Headers
                );

                if (no === -1) {
                    // User voting for the first time
                    setCounts((prevCounts) => {
                        const updatedCounts = [...prevCounts];
                        updatedCounts[ind]++;
                        return updatedCounts;
                    });
                    setNo(ind + 1);
                    setTotal((prevTotal) => prevTotal + 1);
                } else if (ind + 1 !== no) {
                    // User changing their vote
                    setCounts((prevCounts) => {
                        const updatedCounts = [...prevCounts];
                        updatedCounts[no-1]--; // Decrease previous vote
                        updatedCounts[ind]++; // Increase new vote
                        return updatedCounts;
                    });
                    setNo(ind + 1);
                }
            } catch (error) {
                console.error("Error posting opinion:", error);
            }

        };
        const style = {
            background: `linear-gradient(to right, #4CAF50 ${percentage}%, #ffffff ${percentage}%)`,
            borderRadius: 10,
            width : "80%",
            height: 30,
            marginLeft: 50,
            marginRight: 10,
            textAlign: "left",
            paddingLeft: 15,
            fontSize: 20,
            cursor: "pointer"
        };
        return <div style={{display:"flex"}}>
             <p style={style} onClick={handlePoll}>{option}</p>
             <p style={{fontSize:20,color:"white"}}>{counts[ind]}</p>
            </div>
    }
    return <div className="template">
        <Header name={props.name} />
        <p style={{ textAlign: 'left', fontWeight: 600 }}>{props.text}</p>

        {opt1 != "TALK-NULL" && <DisplayOption option={opt1} ind={0} id={props.id} />}
        {opt2 != "TALK-NULL" && <DisplayOption option={opt2} ind={1} id={props.id} />}
        {opt3 != "TALK-NULL" && <DisplayOption option={opt3} ind={2} id={props.id} />}
        {opt4 != "TALK-NULL" && <DisplayOption option={opt4} ind={3} id={props.id} />}

    </div>
}

export default PollTemplate;