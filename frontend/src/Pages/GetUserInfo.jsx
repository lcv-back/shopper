import { useState } from 'react';
import { useUser } from '../Context/UserContext'
import Notification from '../Components/Notification/Notification';

const GetUserInfo = () => {
    const { userInfo, userAddrList, userPayMethod } = useUser();
    const isHaveAddr = userAddrList?.length > 0 && userInfo?.selectAddress;
    const isHavePay = userPayMethod && Object.keys(userPayMethod).length > 0;

    const [formAddr, setFormAddr] = useState(isHaveAddr 
        ? userInfo.selectAddress 
        : { street: '', city: '', country: '' });
    const [formPayment, setFormPayment] = useState(isHavePay 
        ? userPayMethod 
        : { type: 'Visa', holder: '', expiryDate: '' });

    const [isNofication, setIsNofication] = useState({message: "", status: false, show: false});

    const handleAddrChange = (e) => {
        setFormAddr({...formAddr, [e.target.name]: e.target.value});
    }

    const handlePaymentChange = (e) => {
        setFormPayment({...formPayment, [e.target.name]: e.target.value});
        console.log(formPayment)
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const token = localStorage.getItem("auth-token");
        try {
            if(!isHaveAddr) {
                const resAddr = await fetch('http://localhost:4000/address', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    },
                    body: JSON.stringify({
                        street: formAddr.street,
                        city: formAddr.city,
                        country: formAddr.country
                    })
                });
                const resUser = await fetch('http://localhost:4000/users', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    },
                    body: JSON.stringify({
                        selectAddress: {
                            street: formAddr.street,
                            city: formAddr.city,
                            country: formAddr.country
                        }
                    })
                })
                if (!resAddr.ok && !resUser.ok) throw new Error("Failed to submit data");
                
            }
            if(!isHavePay) {
                const res = await fetch('http://localhost:4000/payment', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    },
                    body: JSON.stringify({
                        type: formPayment.type,
                        holder: formPayment.holder,
                        detail: {
                            expiryDate: formPayment.expiryDate
                        }
                    })
                });
                if (!res.ok) throw new Error("Failed to submit data");

            }
        } catch (error) {
            console.log("Failed to update: ", error);
        }

        setIsNofication({message: "Update success!", status: true, show: true});
        setTimeout(()=> {window.location.replace("/")}, 2000);
    }

    return(
        <main class="bg-gray-100">
            <div class="container mx-auto p-6">
                <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                    <h2 class="text-sm mb-6 text-red-800">*Please complete your information</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Address */}
                        {!isHaveAddr && (
                            <div class="mb-6">
                                <h3 class="text-xl font-semibold mb-4 text-gray-700">Address</h3>
                                <div class="mb-4">
                                    <label for="street" class="block text-gray-600 mb-2">Street</label>
                                    <input 
                                        type="text" 
                                        id="street" 
                                        name="street"
                                        onChange={handleAddrChange}
                                        value={formAddr.street}
                                        class="w-full p-3 border border-gray-300 rounded-lg" 
                                        placeholder="123 Main St"
                                    />
                                </div>
                                <div class="mb-4">
                                    <label for="city" class="block text-gray-600 mb-2">City</label>
                                    <input 
                                        type="text" 
                                        id="city" 
                                        name="city"
                                        onChange={handleAddrChange}
                                        value={formAddr.city}
                                        class="w-full p-3 border border-gray-300 rounded-lg" 
                                        placeholder="New York"
                                    />
                                </div>
                                <div class="mb-4">
                                    <label for="country" class="block text-gray-600 mb-2">Country</label>
                                    <input 
                                        type="text" 
                                        id="country" 
                                        name="country"
                                        onChange={handleAddrChange}
                                        value={formAddr.country}
                                        class="w-full p-3 border border-gray-300 rounded-lg" 
                                        placeholder="USA"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Payment */}
                        {!isHavePay && (
                            <div class="mb-6">
                                <h3 class="text-xl font-semibold mb-4 text-gray-700">Payment</h3>
                                <div class="mb-4">
                                    <label for="holder" class="block text-gray-600 mb-2">Card Holder</label>
                                    <input 
                                        type="text" 
                                        id="holder" 
                                        name="holder"
                                        onChange={handlePaymentChange}
                                        value={formPayment.holder}
                                        class="w-full p-3 border border-gray-300 rounded-lg" 
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div class="mb-4">
                                    <label for="type" class="block text-gray-600 mb-2">Card Type</label>
                                    <select 
                                        id="type" 
                                        name="type"
                                        onChange={handlePaymentChange}
                                        value={formPayment.type} 
                                        class="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="Visa">Visa</option>
                                        <option value="Mastercard">MasterCard</option>
                                        <option value="Amex">American Express</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label for="expiryDate" class="block text-gray-600 mb-2">Expiry Date</label>
                                    <input 
                                        type="text" 
                                        id="expiryDate" 
                                        name="expiryDate"
                                        onChange={handlePaymentChange}
                                        value= {formPayment.expiryDate} 
                                        class="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder='26/05'
                                    />
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit"
                            class="w-full text-white p-3 rounded-lg font-semibold hover:bg-orange-600">
                                Submit
                        </button>
                    </form>
                </div>
                {isNofication.show && (
                <Notification message={isNofication.message} status={isNofication.status}/>
                )}
            </div>
        </main>
    )
}

export default GetUserInfo;