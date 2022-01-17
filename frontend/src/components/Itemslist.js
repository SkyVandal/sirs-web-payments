import React from "react";

const ItemsList = () => {
    
    fetch('http://127.0.0.1:8000/api/items/itemslist', {
        method: 'GET',
        headers: 'application/json'
    })

    return
    <div>
        
    </div>

}

export default ItemsList