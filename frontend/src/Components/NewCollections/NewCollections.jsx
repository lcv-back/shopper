import React, { useContext, useEffect, useState } from "react";
import './NewCollections.css'
import Item from '../Item/Item'
import { ShopContext } from "../../Context/ShopContext";

const NewCollections = () => {

    const [new_collection, setNew_collection] = useState([]);
    const { discounts } = useContext(ShopContext);
    const eventDiscount = discounts.filter((discount) => (discount.scope === "all"))
                                    .sort((a, b) => (new Date(b.createAt) - new Date(a.createAt)))[0];

    useEffect(() => {
        fetch('http://localhost:4000/newcollections')
        .then((response) => response.json())
        .then((data) => setNew_collection(data))
    }, [])

    return (
        <div className="new-collections">
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className="collections">
                {new_collection.map((item, i) => {
                    return <Item 
                                key={i} id={item.id} 
                                name={item.name} 
                                image={item.image} 
                                new_price={item.old_price - (eventDiscount.type === "fixed" 
                                            ? eventDiscount.value 
                                            : item.old_price * eventDiscount.value)}
                                old_price={item.old_price}
                            />
                })}
            </div>
        </div>
    )
}

export default NewCollections;