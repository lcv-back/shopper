import {createContext, useState, useEffect, useContext} from 'react'

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState(null);
    const [userAddress, setUserAddress] = useState([]);
    const [userPayment, setUserPayment] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token= localStorage.getItem("auth-token");
            try {
                if(token) {
                    const [infoRes, addrRes, paymentRes] = await Promise.all([
                        fetch("http://localhost:4000/myInfo", {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'auth-token': token
                            }
                        }).then(res => res.json()),
                        fetch("http://localhost:4000/address", {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'auth-token': token
                            }
                        }).then(res => res.json()),
                        fetch("http://localhost:4000/payments", {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'auth-token': token
                            }
                        }).then(res => res.json())
                    ])
                    setUserInfo(infoRes.data);
                    localStorage.setItem("user-info", JSON.stringify(infoRes.data));
                    setUserAddress(addrRes.data);
                    localStorage.setItem("user-addr", JSON.stringify(addrRes.data));
                    setUserPayment(paymentRes.data);
                    localStorage.setItem("user-payment", JSON.stringify(paymentRes.data));
                }
            } catch (error) {
                console.log("Data load error:", error);
            }
        }
        fetchData();
    }, []);
    return(
        <UserContext.Provider 
            value={{userInfo, setUserInfo, userAddress, 
                    setUserAddress, userPayment, setUserPayment}}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);