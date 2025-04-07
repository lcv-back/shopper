import React, { useContext } from "react";
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
    const {product} = props;

    const {addToCart} = useContext(ShopContext)

    console.log(product); 

    return (
        <div className="productdisplay">
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>

                <div className="productdisplay-img">
                    <img className="productdisplay-main-img" src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                        ${product.old_price}
                    </div>
                    <div className="productdisplay-right-price-new">
                        ${product.new_price}
                    </div>
                </div>
                <div className="productdisplay-right-description">
                    A lightweight, usually knitted, pullover shirt, close-fitting and with 
                    a round neckline and short sleeves, worn as an undershirt or outer garments.
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        <div className={product.variants[0].stock === 0 ? "not-available" : ""}>S</div>
                        <div className={product.variants[1].stock === 0 ? "not-available" : ""}>M</div>
                        <div className={product.variants[2].stock === 0 ? "not-available" : ""}>L</div>
                        <div className={product.variants[3].stock === 0 ? "not-available" : ""}>XL</div>
                        <div className={product.variants[4].stock === 0 ? "not-available" : ""}>XXL</div>
                    </div>
                </div>
                <button onClick={() => {addToCart(product.id)}}>ADD TO CART</button>
                <p className="productdisplay-right-category">
                    <span>Category :</span>Women, T-Shirt, Crop Top
                </p>
                <p className="productdisplay-right-category">
                    <span>Tags :</span>Modern, Latest
                </p>
            </div>
        </div>
    )
}

export default ProductDisplay;