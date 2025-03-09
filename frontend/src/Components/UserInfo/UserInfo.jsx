import { useState} from "react";
import { useUser } from "../../Context/UserContext";
import user_icon from "../Assets/user-regular.svg"; 

const UserInfo = () => {
    const  {userInfo, userAddress, setUserAddress, userPayment, setUserPayment} = useUser();
    // State chứa danh sách địa chỉ & thông tin thanh toán
    const [formData, setFormData] = useState({
        name: userInfo?.name||JSON.parse(localStorage.getItem("user-info") || "{}").name,
        email: userInfo?.email||JSON.parse(localStorage.getItem("user-info") || "{}").email,
        addresses: userAddress?.length > 0 
                    ? userAddress 
                    : JSON.parse(localStorage.getItem("user-addr") || "[]"),
        type: userPayment?.length > 0 
                ? userPayment[0].type 
                : JSON.parse(localStorage.getItem("user-payment") || "{}")[0]?.type || "",
        holder: userPayment?.length > 0 
                ? userPayment[0].holder 
                : JSON.parse(localStorage.getItem("user-payment") || "{}")[0]?.holder || "",
        expiryDate: userPayment?.length > 0 
                    ? userPayment[0].detail?.expiryDate 
                    : JSON.parse(localStorage.getItem("user-payment") || "{}")[0].detail?.expiryDate || "",
    });

    const [selectedAddress, setSelectedAddress] = useState(userAddress?.[0] || JSON.parse(localStorage.getItem("user-addr") || "[]")[0]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal

    // Xử lý chọn địa chỉ từ modal
    const handleAddressChange = async (type, addr) => {
        const addrId = addr._id;
        if(type === "select"){
            setSelectedAddress(addr);
        } else if(type === "delete") {
            if(addrId===selectedAddress._id) return;
            const deleteAddr = await fetch(`http://localhost:4000/address/${addrId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if(deleteAddr.ok) {
                setFormData(prev => ({
                    ...prev,
                    addresses: prev.addresses.filter(addr => addr._id !== addrId)
                }));
                setUserAddress(prev => prev.filter(addr => addr._id !== addrId));
                localStorage.setItem("user-addr", JSON.stringify(userAddress));
            }
        } else if(type === "add") {
            
        }
    };
    const handlePaymentChange = (e) => {
        setFormData(prev => ({
            ...prev,  
            [e.target.name]: e.target.value
        }));
        localStorage.setItem("user-payment", JSON.stringify({
            ...JSON.parse(localStorage.getItem("user-payment") || "{}"),
            [e.target.name]: e.target.value
        }));
    };

    const saveChange = async () => {
        if (!userPayment.length) return;
        
        setUserPayment([{ 
                ...userPayment[0], 
                type: formData.type,
                holder: formData.holder, 
                detail: { expiryDate: formData.expiryDate }
        }]);
        const paymentUpdate= await fetch(`http://localhost:4000/payments/${userPayment[0]._id}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: formData.type,
                holder: formData.holder,  
                detail: {
                    expiryDate: formData.expiryDate
                }
            })
        });

        if(paymentUpdate.ok) {
            window.location.href= "/";
        }

    }

    // Mở modal
    const openModal = () => setIsModalOpen(true);
    // Đóng modal
    const closeModal = () => setIsModalOpen(false);


    return (
        <main className="container mx-auto p-4">
            <section className="text-center my-8">
                <img className="rounded-full mx-auto" height="150" src={user_icon} width="150" alt="User Icon"/>
                <h2 className="text-3xl font-bold mt-4">{formData.name}</h2>
                <p className="text-lg text-gray-600">Store Customer</p>
            </section>

            {/* Personal Information */}
            <section className="my-8">
                <h3 className="text-2xl font-bold text-orange-500">Personal Information</h3>
                <div className="mt-4">
                    {/* Tên và Email */}
                    {["name", "email"].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input 
                                className="w-full p-2 border rounded bg-gray-100"
                                type={field === "email" ? "email" : "text"}
                                value={formData[field]}
                                readOnly
                            />
                        </div>
                    ))}

                    {/* Địa chỉ - Mở modal chọn địa chỉ */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <div className="flex items-center gap-4">
                            <input 
                                className="basis-5/6 w-full p-2 border rounded bg-gray-100"
                                type="text"
                                value={selectedAddress.street + ", " + selectedAddress.city}
                                readOnly
                            />
                            <button 
                                className="basis-1/6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                                onClick={openModal}
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Information */}
            <section className="my-8">
                <h3 className="text-2xl font-bold text-orange-500">Payment Information</h3>
                <div className="mt-4">
                    {["type", "holder", "expiryDate"].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block text-gray-700">
                            {field === "type" ? "Card Type" 
                                : field === "holder" ? "Card Holder" 
                                : "Expiry Date"}
                            </label>
                            <input 
                                className="w-full p-2 border rounded bg-gray-100"
                                type="text"
                                name= {field}
                                value={formData[field]}
                                onChange={handlePaymentChange}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Save Changes Button */}
            <div className="text-center mt-8">
                <button 
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    onClick={()=>saveChange(formData)}
                >
                    Save Changes
                </button>
            </div>

            {/* Modal chọn địa chỉ */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Choose address</h3>
                        <div className="flex flex-col gap-2">
                            {formData.addresses.map((addr, index) => (
                                <label key={index} className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                                <input 
                                    type="radio"
                                    name="address"
                                    className="basis-1/6"
                                    value={addr._id} 
                                    checked={selectedAddress._id === addr._id} 
                                    onChange={() => handleAddressChange("select",addr)} 
                                />
                                <div className="basis-4/6">{addr.street}, {addr.city}</div>
                                <button className="basis-1/6" onClick={()=>handleAddressChange("delete", addr)}>
                                    <i className="far fa-trash-alt"></i>
                                </button>
                                </label>
                            ))}
                            <label className="flex items-center p-2 border rounded cursor-pointer">
                                <div className="basis-2/5"></div>
                                <button className="basis-1/5 p-0 mx-6"><i className="fas fa-plus fa-sm"></i></button>
                                <div className="basis-2/5"></div>
                            </label>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={closeModal}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default UserInfo;
