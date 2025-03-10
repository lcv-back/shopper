import { useUser } from "../../../Context/UserContext";

const ShippingDetails = () => {
    const {userInfo} = useUser();


    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-600 mb-2" htmlFor="shipping-address">Address</label>
                    <input
                        name="address"
                        className="w-full border rounded px-4 py-2"
                        value= {userInfo.selectAddress?.street||""}
                        id="shipping-address"
                        type="text"
                        readOnly
                    />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-2" htmlFor="shipping-city">City</label>
                        <input
                            name="city"
                            className="w-full border rounded px-4 py-2"
                            value= {userInfo.selectAddress?.city||""}
                            id="shipping-city"
                            type="text"
                            readOnly
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-2" htmlFor="shipping-country">Country</label>
                        <input
                            name="country"
                            className="w-full border rounded px-4 py-2"
                            value= {userInfo.selectAddress?.country||""}
                            id="shipping-country"
                            type="text"
                            readOnly
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ShippingDetails;
