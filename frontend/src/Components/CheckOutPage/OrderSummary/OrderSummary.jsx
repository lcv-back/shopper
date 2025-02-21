import { useContext, useState } from "react";
import { ShopContext } from "../../../Context/ShopContext";
import { useCheckout } from "../../../Context/CheckOutContext";
import ModalDialog from "../../ModalDialog/ModalDialog";
import Notification from "../../Notification/Notification";

const OrderSummary = () => {
    const { all_product, cartItems, getTotalCartAmount, discounts } = useContext(ShopContext);
    const { paymentData, shippingData, paymentMethod } = useCheckout();
    const [selectedVoucher, setSelectedVoucher] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [notification, setNotification] = useState({message: "", status: false, show: false});

    const formData = {
        paymentMethod,
        cardInfo: {
            cardName: paymentData.cardName,
            cardNumber: paymentData.cardNumber,
            cardExpired: paymentData.cardExpired,
            cardCvc: paymentData.cardCvc
        },
        shipAddress: {
            address: shippingData.address,
            city: shippingData.city,
            country: shippingData.country
        }
    };

    let total = getTotalCartAmount();
    const shippingPrice = 10;
    const tax = 0.05;
    const countTotal = () => {
        total = total + tax + shippingPrice; 
        selectedVoucher.forEach((discount) => {
            if(discount.type === "percentage") {
                total -= total * (discount.value);
            }
            if(discount.type === "fixed") {
                total -= discount.value;
            }
        })
        return total <= 0 ? 0 :total.toFixed(2);
    };

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem("auth-token");
            if(!token) {
                setNotification({message: "Please log in to order!", status: false, show: true});
                setTimeout(() => setNotification({show: false}, 3000));
                return;
            }

            const response = await fetch("http://localhost:4000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({...formData, totalPrice: total})
            });
            const data = await response.json();

            if (data.success) {
                setNotification({message: "Payment successful !", status: true, show: true});
                const emailFormData = {
                    orderId: data._id,
                    totalPrice: total.toFixed(2),
                    address: formData.shipAddress.address + ", " + formData.shipAddress.city
                }
                const emailResponse = await fetch('http://localhost:4000/sendmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "auth-token": token
                    },
                    body: JSON.stringify(emailFormData),
                })
                const emailData = await emailResponse.json();
                if(emailData.success) {
                    setNotification({show: false});
                    setTimeout(()=> {window.location.replace("/")}, 2000);
                } else {
                    setTimeout(() => setNotification({message: "Send email failed !", status: false, show: true}), 2000);
                }
            } else {
                setNotification({message: "Payment failed !", status: false, show: true});
                setTimeout(() => setNotification({show: false}), 2000);
            }
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            alert("Có lỗi xảy ra khi đặt hàng!");
        }
    };
    const ListVoucher = ({ discounts }) => {
        const validDiscounts = discounts.filter(discount => discount.scope === "all");
    
        return (
            <div>
                {validDiscounts.length > 0 ? (
                    validDiscounts.map((discount, index) => (
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mt-2">
                                    <span className="w-full px-4 py-2">{discount.code}</span>
                                    <span className="w-full px-4 py-2">-{discount.value}{discount.type==="percentage" ? "%" : ""}</span>
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 mx-4 my-2 focus:outline-none"
                                        checked= {selectedVoucher.some(d => d.code===discount.code)}
                                        onChange={() => handleVoucherChange(discount)}/>
                                </div>
                    ))
                ) : (
                    <p className="text-gray-500">Don't have any voucher available</p>
                )}
            </div>
        );
    }; 
    const handleVoucherChange = (discount) => {
        setSelectedVoucher((prevSelected) => {
            if(prevSelected.some(d => d.code === discount.code)) {
                return prevSelected.filter(d => d.code !== discount.code);
            } else {
                return [...prevSelected, discount];
            }
        })
    }
    return (
        <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {all_product.map((item) =>
                cartItems[item.id] && cartItems[item.id] > 0 ? (
                    <div key={item.id} className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <img alt={item.name} className="w-12 h-12 object-cover mr-4" src={item.image} />
                            <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-gray-800">${item.new_price}</span>
                    </div>
                ) : null
            )}
            <div className="flex justify-between mb-4">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">${shippingPrice}</span>
            </div>
            <div className="flex justify-between mb-4">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">${tax}</span>
            </div>
            <div className="flex justify-between mb-4">
                <span className="text-gray-600">Discount Voucher</span>
                <button
                    className="size-4 rounded-full flex items-center justify-center"
                    onClick={() => setIsOpenModal(true)}
                >
                    <i className="fas fa-pen fa-xs"></i>
                </button>
            </div>
            <div className="border-t pt-4 flex justify-between">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold">${countTotal()}</span>
            </div>
            <button className="bg-red-500 text-white rounded px-6 py-2 w-full mt-6" onClick={handleCheckout}>
                PLACE ORDER
            </button>
            {isOpenModal && (
                <ModalDialog 
                    onClose={() => setIsOpenModal(false)}
                    modalFunction={() => countTotal()}
                    modalTitle= "Discount Voucher" 
                    modalContent= {<ListVoucher discounts={discounts}/>}
                />)}
            {notification.show && (
                <div className= "fixed top-5 right-5 z-50">
                    <Notification
                        message={notification.message}
                        status={notification.status}
                    />
                </div>

            )}
        </div>
    );
};

export default OrderSummary;
