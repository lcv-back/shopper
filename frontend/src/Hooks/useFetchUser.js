import {useState, useCallback, useEffect} from 'react'

const useFetchUser= () => {
    const [userInfo, setUserInfo] = useState(null);
    const [userAddrList, setUserAddrList] = useState([]);
    const [userPayMethod, setUserPayMethod] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback( async (type) => {
        const token = localStorage.getItem("auth-token");

        if(!token) {
            setLoading(false);
            return;
        }

        try {
            let res;
            if(type === "user-info") {
                res = await fetch("http://localhost:4000/myInfo", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    }
                }).then (res => res.json());
                setUserInfo(res.data);
            } else if(type === "user-addr-list") {
                res = await fetch("http://localhost:4000/address", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    }
                }).then(res => res.json());
                setUserAddrList(res.data);                    
            } else if(type === "user-pay-method") {
                res = await fetch("http://localhost:4000/payments", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token
                    }
                }).then(res => res.json());
                setUserPayMethod(res.data);
            }
        } catch (error) {
            console.log("Fail to fetch data: ", error);
        }
    }, []);

    useEffect(() => {
        const initData= async() => {
            await Promise.all([fetchData("user-info"), fetchData("user-addr-list"), fetchData("user-pay-method")]);
            setTimeout(()=>setLoading(false), 2000);
        }
        initData();
    }, [fetchData])

    return {userInfo, userAddrList, userPayMethod, loading, fetchData}
}

export default useFetchUser;