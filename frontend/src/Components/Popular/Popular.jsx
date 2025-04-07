import React, {useContext, useEffect, useState} from 'react';
import './Popular.css'
import Item from '../Item/Item.jsx'
import { ShopContext } from '../../Context/ShopContext.jsx';

const Popular = () => {

    const [popularProducts, setPopularProducts] = useState([]);
    const { discounts } = useContext(ShopContext);
    const eventDiscount = discounts.filter((discount) => (discount.scope === "all"))
                                    .sort((a, b) => (new Date(b.createAt) - new Date(a.createAt)))[0];

    useEffect(() => {
        fetch('http://localhost:4000/popularwomen')
        .then((response) => response.json())
        .then((data) => setPopularProducts(data))
    }, [])

    return (
        <div className='popular'>
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className="popular-item">
                {popularProducts.map((item, i) => {
                    return <Item 
                            key={i} 
                            id={item.id} 
                            name={item.name} 
                            image={item.image} 
                            new_price={item.old_price - (eventDiscount.type === "fixed" 
                                ? eventDiscount.value 
                                : item.old_price * eventDiscount.value)}
                            old_price={item.old_price}/>
                })}
            </div>
        </div>
    );
}

export default Popular;