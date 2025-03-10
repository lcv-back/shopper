import {createContext, useContext} from 'react'
import useFetchUser from '../Hooks/useFetchUser';
import Loading from "../Pages/Loading";
const UserContext = createContext();

export const UserProvider = ({children}) => {
    const {userInfo, userAddrList, userPayMethod, loading, fetchData} = useFetchUser();

    if(loading) {
        return <Loading/>
    }

    return(
        <UserContext.Provider value={{userInfo, userAddrList, userPayMethod, fetchData}}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);