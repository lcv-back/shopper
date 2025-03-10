import { useCheckout } from '../../../Context/CheckOutContext';
import { useUser } from "../../../Context/UserContext";

const PaymentMethod = () => {
    const { paymentMethod, setPaymentMethod } = useCheckout();
    const { userPayMethod } = useUser();
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === "paymentMethod") setPaymentMethod(value);
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
                            <label className="block text-gray-600 mb-2" htmlFor="card-holder">Name on Card</label>
                            <input
                                name="cardHolder"
                                className="w-full border rounded px-4 py-2"
                                value={userPayMethod?.holder||""}
                                onChange={handleChange}
                                id="card-holder"
                                type="text"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2" htmlFor="card-type">Card Type</label>
                            <input
                                name="cardType"
                                className="w-full border rounded px-4 py-2"
                                value={userPayMethod?.type ||""}
                                onChange={handleChange}
                                id="card-type"
                                type="text"
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex-1">
                                <label className="block text-gray-600 mb-2" htmlFor="card-expiry">Expiry Date</label>
                                <input
                                    name="cardExpired"
                                    className="w-full border rounded px-4 py-2"
                                    value= {userPayMethod?.detail?.expiryDate ||""}
                                    onChange={handleChange}
                                    id="card-expiry"
                                    type="text"
                                    readOnly
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
