import React from "react";
import "./SingleItem.css"

function Singleitem(props) {
    return (
        <div className="Singleitem">
            <span>Title: {props.title}</span>
            <span> Description: {props.description}</span>
            <span> Price: {props.price}</span>
        </div>
    )
}

export default Singleitem;