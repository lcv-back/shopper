import React, { useState } from "react";
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: '',
        old_price: '',
        new_price: '',
        category: 'women',
        image: '',
    });
    const [notification, setNotification] = useState(null); // State for notification

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value,
        });
    };

    const Add_Product = async () => {
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((res) => res.json()).then((data) => {
            responseData = data;
        });

        if (responseData.success) {
            product.image = responseData.image_url;
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(product),
            }).then((res) => res.json()).then((data) => {
                if (data.success) {
                    showNotification(`Added product: ${product.name}`, 'success');
                } else {
                    showNotification(`Failed to add product: ${product.name}`, 'fail');
                }
            });
        } else {
            showNotification('Image upload failed', 'fail');
        }
    };

    const showNotification = (message, type) => {
        const currentTime = new Date().toLocaleString();
        setNotification({ message, type, time: currentTime });

        // Hide notification after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    return (
        <div className="add-product">
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Type here" />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type here" />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type here" />
                </div>
                <div className="addproduct-itemfield">
                    <p>Product Category</p>
                    <select value={productDetails.category} onChange={changeHandler} name="category" className="addproduct-selector">
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kid">Kid</option>
                    </select>
                </div>
                <div className="addproduct-itemfield">
                    <label htmlFor="file-input">
                        <img src={image ? URL.createObjectURL(image) : upload_area} className="addproduct-thumbnail-img" alt="" />
                    </label>
                    <input onChange={imageHandler} type="file" name="name" id="file-input" hidden />
                </div>
                <button onClick={Add_Product} type="submit" className="addproduct-btn">Add Product</button>
            </div>

            {/* Notification Box */}
            {notification && (
                <div className={`notification-box ${notification.type}`}>
                    <p>{notification.message}</p>
                    <p>{notification.time}</p>
                </div>
            )}
        </div>
    );
};

export default AddProduct;
