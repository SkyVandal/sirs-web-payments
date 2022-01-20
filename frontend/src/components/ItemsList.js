import React, { useState, useEffect, setState } from 'react';
import Singleitem from './Singleitem';


const ItemsList = (props) => {
    let itemslist;


    /*fetch('http://127.0.0.1:8000/api/items/itemslist', {
        method: 'GET',
        headers: 'application/json'
    })  .then(response => response.json())
        .then(result => {
            itemslist = result;
        })
        .catch(e => {
            console.log(e);
            //this.setState({...this.state, isFetching: false});
        });

    return (
        <div>
            <h1>This is the items list:</h1>
            {itemslist}
        </div>
        
    )*/

    return (
        <div>
            <div className="itemslist"><h3>Items List</h3></div>
            {props.items.map(c => <Singleitem key={c.key} title={c.title} description={c.description} price={c.price} />)}
        </div>
    )
}

export default ItemsList