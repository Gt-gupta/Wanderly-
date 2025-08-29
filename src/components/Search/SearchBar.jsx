import React from "react";
import "./search.css";
function SearchBar(props){
    return <div>
        <input className="searchBar" placeholder="Search Users here..." onChange={(event)=> {props.handleChange(event);}}  />
    </div>
}

export default SearchBar;