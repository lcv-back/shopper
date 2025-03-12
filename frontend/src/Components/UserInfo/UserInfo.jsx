import { useState} from "react";
import { useUser } from "../../Context/UserContext";
import user_icon from "../Assets/user-regular.svg"; 
import Notification from "../Notification/Notification";
import ModalDialog from "../ModalDialog/ModalDialog";

const UserInfo = () => {
    const  {userInfo, userAddrList, userPayMethod} = useUser();
    // State chứa danh sách địa chỉ & thông tin thanh toán
    const [formData, setFormData] = useState({
        name: userInfo?.name||"",
        email: userInfo?.email||"",
        addresses: userAddrList?.length > 0 ? userAddrList : [],
        type: userPayMethod?.type || "",
        holder: userPayMethod?.holder || "",
        expiryDate: userPayMethod?.detail?.expiryDate || "",
    });

    const [selectedAddress, setSelectedAddress] = useState(userInfo?.selectAddress||JSON.parse(localStorage.getItem("selected-addr")));
    const [isModalAddrListOpen, setIsModalAddrListOpen] = useState(false); // Trạng thái mở/đóng modal
    const [isModalAddrOpen, setIsModalAddrOpen] = useState(false); //Trạng thái mở/đóng modal thêm addr
    const [notification, setNotification] = useState({message: "", status: false, show: false}); //Trạng thái thông báobáo
    const [addrDeleteList, setAddrDeleteList] = useState([]); //Trạng thái danh sách các addr cần xóa
    const [addrAddList, setAddrAddList] = useState([]); //Trạng thái danh sách các addr cần thêm

    // Xử lý thêm, sửa, xóa địa chỉ từ modal
    const handleAddressChange = async (type, addr) => {
        const addrId = addr._id;
        const addrStreet = addr.street;
        const addrCity = addr.city;
        const addrCountry = addr.country;
        
        if(type === "select"){
            localStorage.setItem("selected-addr", JSON.stringify(addr));
            setSelectedAddress(addr);
        } else if(type === "delete") {
            if(addrId===selectedAddress._id) return;
            const addrDelete = {
                ...addr
            };
            setAddrDeleteList((list)=>[...list, addrDelete]);
            setFormData(prev => ({
                ...prev,
                addresses: prev.addresses.filter(addr => 
                    addr._id 
                    ? addr._id !== addrId 
                    : !(addr.street === addrStreet && addr.city === addrCity && addr.country === addrCountry)
                )
            }));
        } else if(type === "add") {
            const addrAdd = {
                street: addr.street,
                city: addr.city,
                country: addr.country
            };
            setAddrAddList((list) => [...list, addrAdd]);
            setFormData(prev => ({
                ...prev,
                addresses: [...prev.addresses, addr]
            }))
        }
    };

    //Xử lý thay đổi thông tin payment
    const handlePaymentChange = (e) => {
        setFormData(prev => ({
            ...prev,  
            [e.target.name]: e.target.value
        }));
    };

    const getAddrToUpdate = (initialAddr, curAddr, addrDeleteList, addrAddList) => {
        // Tạo Set chứa ID của địa chỉ ban đầu
        const initialAddrIds = new Set(initialAddr.map(addr => addr._id));
    
        // Tạo danh sách chứa các địa chỉ không có id (vì các địa chỉ được thêm trên UI không có _id)
        const deletedAddrStrings = addrDeleteList.filter(addr => !addr._id);
    
        // Tạo danh sách địa chỉ cần xóa (chỉ xóa nếu ID có trong danh sách ban đầu)
        const addrToDelete = addrDeleteList.filter(addr => initialAddrIds.has(addr._id));
    
        // Lọc danh sách địa chỉ cần thêm (không có _id và chưa bị xóa ngay sau khi thêm)
        const addrToAdd = addrAddList.filter(addr => !deletedAddrStrings.some(deleted => 
            deleted.street === addr.street && 
            deleted.city === addr.city &&
            deleted.country === addr.country
        ));

        // Nếu danh sách ban đầu không thay đổi, trả về danh sách rỗng
        if (addrToAdd.length === 0 && addrToDelete.length === 0) {
            return { addrToAdd: [] , addrToDelete: [] };
        }
        return {addrToAdd, addrToDelete};
    };
    

    const saveChange = async (paymentId) => {
        try {
            const token = localStorage.getItem("auth-token");
    
            // Cập nhật thông tin thanh toán
            const paymentUpdate = await fetch(`http://localhost:4000/payments/${paymentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: formData.type,
                    holder: formData.holder,
                    detail: { expiryDate: formData.expiryDate }
                })
            });
    
            // Cập nhật địa chỉ đã chọn
            const addrUpdate = await fetch("http://localhost:4000/users/address", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify(selectedAddress)
            });
    
            // Lấy danh sách cần thêm/xóa
            const { addrToAdd, addrToDelete } = getAddrToUpdate(userAddrList, formData.addresses, addrDeleteList, addrAddList);
            
            // Cập nhật các địa chỉ đã thêm
            if(addrToAdd.length > 0){
                // Chờ thêm địa chỉ mới
                await Promise.all(
                    addrToAdd.map(async (addr) => {
                        await fetch("http://localhost:4000/address", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "auth-token": token
                            },
                            body: JSON.stringify({
                                street: addr.street,
                                city: addr.city,
                                country: addr.country
                            })
                        });
                    })
                );
            }
    
            //Cập nhật các địa chỉ đã xóa
            if(addrToDelete.length > 0){
                // Chờ xóa địa chỉ cũ
                await Promise.all(
                    addrToDelete.map(async (addr) => {
                        await fetch(`http://localhost:4000/address/${addr._id}`, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        });
                    })
                );
            }

            // Kiểm tra xem tất cả request đều thành công
            if (paymentUpdate.ok && addrUpdate.ok) {
                setNotification({ message: "Save success!", status: true, show: true });
                setTimeout(() => window.location.replace("/"), 10000);
            } else {
                console.error("Failed to update payment or address");
            }
    
        } catch (error) {
            console.error("Update failed:", error);
            setNotification({ message: "Update failed!", status: false, show: true });
        }
    };    

    // Mở modal
    const openModal = () => setIsModalAddrListOpen(true);
    const openAddrModal = () => setIsModalAddrOpen(true);
    // Đóng modal
    const closeModal = () => setIsModalAddrListOpen(false);
    const closeAddrModal = () => setIsModalAddrOpen(false);

    //Function để render body (dùng cho componet ModalDialog)
    const renderModalBody = () => {
        return (
            <div className="flex flex-col gap-2">
                {formData.addresses.map((addr, index) => (
                    <label key={index} className="flex items-center gap-2 p-2 border rounded cursor-pointer mb-2">
                        <input 
                            type="radio"
                            name="address"
                            className="basis-1/6"
                            value={addr._id} 
                            checked={selectedAddress._id === addr._id} 
                            onChange={() => handleAddressChange("select", addr)} 
                        />
                        <div className="basis-4/6">{addr.street}, {addr.city}</div>
                        <button className="basis-1/6" onClick={() => handleAddressChange("delete", addr)}>
                            <i className="far fa-trash-alt"></i>
                        </button>
                    </label>
                ))}
                <label className="flex items-center p-2 border rounded cursor-pointer">
                    <div className="basis-2/5 ms-3"></div>
                    <button className="h-11 basis-1/5 p-0 mx-6" onClick={() => openAddrModal()}><i className="fas fa-plus fa-sm"></i></button>
                    <div className="basis-2/5 me-3"></div>
                </label>
            </div>
        )
    };

    // Lấy dữ liệu từ form điền địa chỉ
    const handleAddAddress = () => {
        const form = document.querySelector("#addAddrForm");
        const formAddrData = new FormData(form);
        const newAddr = {
            street: formAddrData.get("street").trim(),
            city: formAddrData.get("city").trim(),
            country: formAddrData.get("country").trim()
        }
        if (!newAddr.street || !newAddr.city || !newAddr.country) {
            setNotification({ message: "Please fill all fields!", status: false, show: true });
            setTimeout(()=>{setNotification({show: false})}, 1000);
            return;
        }
        handleAddressChange("add", newAddr);
    }

    
    const renderModalAddrBody = () => {
        return (
            <form className="flex flex-col gap-2" id="addAddrForm">
                {["street", "city", "country"].map((field) => (
                    <div className="mb-2">
                        <label key={field} className="flex items-center gap-2 p-2 cursor-pointer">
                            {field.toLocaleUpperCase()}
                        </label>
                        <input 
                                type="text"
                                name= {field}
                                className="h-8 w-full border rounded focus:outline-gray-300"
                        />
                    </div>
                ))}
            </form>
        );
    };
    

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
                    onClick={()=>saveChange(userPayMethod._id)}
                >
                    Save Changes
                </button>
            </div>

            { isModalAddrListOpen && (
                <ModalDialog
                    onClose={()=>closeModal()}
                    modalTitle= {"Address List"}
                    renderBody= {() => renderModalBody()}
                />
            )}

            { isModalAddrOpen && (
                <ModalDialog
                    onClose= {() => closeAddrModal()}
                    modalTitle= {"Add address"}
                    renderBody={() => renderModalAddrBody()}
                    func= {()=> handleAddAddress()}
                />
            )}

            {notification.show && (
                <div className= "fixed top-5 right-5 z-50">
                    <Notification
                        message={notification.message}
                        status={notification.status}
                    />
                </div>
            )}
        </main>
        
    );
};

export default UserInfo;
