import { useEffect, useState } from "react";
import './Order.css';
const Order = () => {
    const [orders, setOrders] = useState([]);

    const fetchInfo = async () => {
        try {
            const response = await fetch('http://localhost:4000/getorders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <div className="list-order">
            <h1>Order List</h1>
            <div className="listorder-header">
                <p>User ID</p>
                <p>Total Price</p>
                <p>Status</p>
                <p>Create At</p>
            </div>
            <hr className="first-hr" />
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div key={index}>
                        <div className="listorder-item">
                            <p>{order.userId}</p>
                            <p>{order.totalPrice.toLocaleString()} $</p>
                            <p>{order.status}</p>
                            <p>{new Date(order.createAt).toLocaleDateString()}</p>
                        </div>
                        <hr className="second-hr" />
                    </div>
                ))
            ) : (
                <p className="empty-order">No order!</p>
            )}
        </div>
    );
};

export default Order;
