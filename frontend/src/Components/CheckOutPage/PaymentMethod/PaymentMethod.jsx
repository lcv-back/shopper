import { useCheckout } from "../../../Context/CheckOutContext";

const PaymentMethod = () => {
    const { setPaymentData } = useCheckout();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-600 mb-2" htmlFor="card-type">Type of Card</label>
                    <input
                        name="type"
                        className="w-full border rounded px-4 py-2"
                        onChange={handleChange}
                        id="card-type"
                        type="text"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2" htmlFor="card-name">Name on Card</label>
                    <input
                        name="name"
                        className="w-full border rounded px-4 py-2"
                        onChange={handleChange}
                        id="card-name"
                        type="text"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2" htmlFor="card-number">Card Number</label>
                    <input
                        name="number"
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
                            name="expired"
                            className="w-full border rounded px-4 py-2"
                            onChange={handleChange}
                            id="card-expiry"
                            type="text"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-2" htmlFor="card-cvc">CVC</label>
                        <input
                            name="cvc"
                            className="w-full border rounded px-4 py-2"
                            onChange={handleChange}
                            id="card-cvc"
                            type="text"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PaymentMethod;
