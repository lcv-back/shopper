import React, { createContext, useEffect, useState} from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {}
    for(let idx = 0; idx < 300+1; idx++) {
        cart[idx] = 0;
    }
    return cart
}

const ShopContextProvider = (props) => {

    const [all_product, setAll_Product] = useState([])

    const [discounts, setDiscounts] = useState([]);

    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, discountsRes] = await Promise.all([
                    fetch('http://localhost:4000/allproducts').then(res => res.json()),
                    fetch('http://localhost:4000/discounts').then(res => res.json()),
                ]);

                const eventDiscount = discountsRes.data.filter((discount) => (discount.scope === "all"))
                                    .sort((a, b) => (new Date(b.createAt) - new Date(a.createAt)))[0];
                const discountProduct = productsRes.map((product) => ({
                    ...product,
                    new_price: product.old_price - (eventDiscount.type === "fixed" 
                        ? eventDiscount.value 
                        : product.old_price * eventDiscount.value)
                }))
                setAll_Product(discountProduct);
                setDiscounts(discountsRes.data);
                setCartItems(getDefaultCart(discountProduct));
                if (localStorage.getItem('auth-token')) {
                    const cartRes = await fetch('http://localhost:4000/getcart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': localStorage.getItem('auth-token'),
                        },
                        body: "",
                    }).then(res => res.json());
                    setCartItems(cartRes);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] + 1
        }))

        if(localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    Accept: 'application/form-data',
                },
                body: JSON.stringify({"itemId": itemId})
            })
            .then((response) => response.json())
            .then((data) => console.log(data))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1
        }))

        if(localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({"itemId": itemId})
            })
            .then((response) => response.json())
            .then((data) => console.log(data))
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0
        for(const item in cartItems){
            if(cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item))
                totalAmount += itemInfo.new_price * cartItems[item]
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0
        for(const item in cartItems) {
            if(cartItems[item] > 0) {
                totalItem += cartItems[item]
            }
        }
        return totalItem
    }
    
    
    const contextValue = 
        {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, 
            removeFromCart, discounts};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;