import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [ paymentMethod, setPaymentMethod ] = useState("");

    return (
        <CheckoutContext.Provider value = {{paymentMethod, setPaymentMethod}}>
            {children}
        </CheckoutContext.Provider>
    )
}
export const useCheckout = () => useContext(CheckoutContext);