import React, { useContext } from "react";
import {Link} from "react-router";
import './CartItems.css';
import { ShopContext } from "../../Context/ShopContext";
import { useUser } from "../../Context/UserContext";
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const {getTotalCartAmount, all_product, cartItems, removeFromCart} = useContext(ShopContext);
    const isAuth = localStorage.getItem("auth-token") ? true : false;
    const {userAddrList, userPayMethod} = useUser();
    const isHaveAddr = userAddrList?.length > 0;
    const isHavePay = userPayMethod && Object.keys(userPayMethod).length > 0;
    const total = getTotalCartAmount();
    return (
        <div className="cartitems">
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                console.log("Product ID:", e.id, "Cart Quantity:", cartItems[e.id]);
                if(cartItems[e.id] && cartItems[e.id] > 0) {
                    return (
                        <div>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className="carticon-product-icon"/>
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                                <p>${e.new_price * cartItems[e.id]}</p>
                                <img className="cartitems-remove-icon" src={remove_icon} onClick={() => {removeFromCart(e.id)}} alt="" />
                            </div>
                            <hr />
                        </div>
                    )
                }
                return null
            })}

            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>$10</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${total===0 ? 0 : total + 10}</h3>
                        </div>
                    </div>
                    <button><Link to= {isAuth ? ((!isHaveAddr || !isHavePay) ? "/getinfo" : "/checkout") : "/login"}>PROCEED TO CHECKOUT</Link></button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input type="text" placeholder="promo code"/>
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems;