import { useCheckout } from "../../../Context/CheckOutContext";
const PaymentMethod = () => {
    const { setPaymentData } = useCheckout();
    const {paymentMethod, setPaymentMethod} = useCheckout();
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === "paymentMethod") setPaymentMethod(value);
        setPaymentData((prev) => ({ ...prev, [name]: value }));
    };
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-600 mb-2" htmlFor="payment-method">Payment Method</label>
                    <select className="w-full border rounded px-4 py-2" id="payment-method" 
                            name="paymentMethod" required defaultValue="" value={paymentMethod} onChange={handleChange}>
                        <option value="" disabled>Select payment method</option>
                        <option value="cod">Cash on Delivery (COD)</option>
                        <option value="card">Credit/Debit Card</option>
                    </select>
                </div>
                {(paymentMethod === "card") && (
                    <div>
                        <div>
                            <label className="block text-gray-600 mb-2" htmlFor="card-name">Name on Card</label>
                            <input
                                name="cardName"
                                className="w-full border rounded px-4 py-2"
                                onChange={handleChange}
                                id="card-name"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2" htmlFor="card-number">Card Number</label>
                            <input
                                name="cardNumber"
                                className="w-full border rounded px-4 py-2"
                                onChange={handleChange}
                                id="card-number"
                                type="text"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex-1">
                                <label className="block text-gray-600 mb-2" htmlFor="card-expiry">Expiry Date</label>
                                <input
                                    name="cardExpired"
                                    className="w-full border rounded px-4 py-2"
                                    onChange={handleChange}
                                    id="card-expiry"
                                    type="text"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-600 mb-2" htmlFor="card-cvc">CVC</label>
                                <input
                                    name="cardCvc"
                                    className="w-full border rounded px-4 py-2"
                                    onChange={handleChange}
                                    id="card-cvc"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PaymentMethod;
