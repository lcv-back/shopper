import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [shippingData, setShippingData] = useState({
        address: '',
        city: '',
        country: ''
    });
    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardHolder: '',
        cardExpired: '',
        cardCvc: ''
    });
    const [paymentMethod, setPaymentMethod] = useState("");
    return (
        <CheckoutContext.Provider value = {{shippingData, setShippingData, paymentData, setPaymentData, paymentMethod, setPaymentMethod}}>
            {children}
        </CheckoutContext.Provider>
    )
}
export const useCheckout = () => useContext(CheckoutContext);