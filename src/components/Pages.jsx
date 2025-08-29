import React, { useState } from "react";
import PagesFrame from "./PagesFrame";
import pages_types from "../pages_types";

function Pages(props){
    const [currentIndex,setIndex] = useState(0);
    function selectIndex(no){
        setIndex(no);
    }
    return <>
        {pages_types.map((page,index) => {
            return <PagesFrame 
            name={page.name} 
            img={currentIndex===index ? page.chosenImg : page.img} 
            index = {index} 
            chosenIndex = {currentIndex} 
            selectIndex={selectIndex} 
            update = {props.update}
            /> 
        })}
    </>
}

export default Pages;