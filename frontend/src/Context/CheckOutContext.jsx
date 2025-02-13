import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [shippingData, setShippingData] = useState({
        address: '',
        city: '',
        country: ''
    });
    const [paymentData, setPaymentData] = useState({
        type: '',
        name: '',
        number: '',
        expired: '',
        cvc: ''
    });
    return (
        <CheckoutContext.Provider value = {{shippingData, setShippingData, paymentData, setPaymentData}}>
            {children}
        </CheckoutContext.Provider>
    )
}
export const useCheckout = () => useContext(CheckoutContext);