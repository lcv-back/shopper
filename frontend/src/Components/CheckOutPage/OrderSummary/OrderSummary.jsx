import {useContext} from "react";
import { ShopContext } from "../../../Context/ShopContext";
import { useCheckout } from "../../../Context/CheckOutContext";

const OrderSummary = () => {
    const {all_product, cartItems, getTotalCartAmount} = useContext(ShopContext);
    const {paymentData, shippingData} = useCheckout();
    const shippingPrice = 10;
    let totalPrice = getTotalCartAmount();
    const tax= 0.05*totalPrice;
    totalPrice += tax + shippingPrice;
    const formData = {
        payment: {
            type: paymentData.type,
            name: paymentData.name,
            number: paymentData.number,
            expired: paymentData.expired,
            cvc: paymentData.cvc
        },
        shipAddress: {
            address: shippingData.address,
            city: shippingData.city,
            country: shippingData.country
        }
    }
    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            console.log(formData)
            const response = await fetch('http://localhost:4000/docheckout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (data.success) {
                window.location.replace('/');
            } else {
                alert('Thanh toán thất bại!');
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            alert('Có lỗi xảy ra khi đặt hàng!');
        }
    };
    

    return (
        <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {all_product.map((item) => {
                if(cartItems[item.id]&&cartItems[item.id]>0) {
                    return (
                        <div key={item.id} className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <img
                            alt={item.name}
                            className="w-12 h-12 object-cover mr-4"
                            src={item.image}
                            />
                            <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-gray-800">${item.new_price}</span>
                        </div>
                    )
                }
                return null;
            }
                
      )}
            <div className="flex justify-between mb-4">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">${shippingPrice}</span>
            </div>
            <div className="flex justify-between mb-4">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">${tax}</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold">${totalPrice}</span>
            </div>
            <button className="bg-red-500 text-white rounded px-6 py-2 w-full mt-6" onClick={handleCheckout}>PLACE ORDER</button>
        </div>
    );
}

export default OrderSummary;