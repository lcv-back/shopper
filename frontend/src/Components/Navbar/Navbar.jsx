import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import guest_icon from '../Assets/user-solid.svg'
import user_icon from '../Assets/user-regular.svg'
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { useUser } from '../../Context/UserContext';
import  nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {

    const [menu, setMenu] = useState("shop")

    const {getTotalCartItems} = useContext(ShopContext)

    const { userAddrList, userPayMethod } = useUser();
    
    const isHaveAddr = userAddrList?.length > 0;
    const isHavePay = userPayMethod && Object.keys(userPayMethod).length > 0;

    const menuRef = useRef()

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible')
        e.target.classList.toggle('open')
    }

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="" />
                <p>SHOPPER</p>
            </div>
            <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
            <ul ref={menuRef} className='nav-menu'>
                <li onClick={() => {setMenu("shop")}}><Link style={{textDecoration: 'none'}} to='/'>Shop</Link>{menu === "shop" ? <hr/>:<></>}</li>
                <li onClick={() => {setMenu("mens")}}><Link style={{textDecoration: 'none'}}  to='mens'>Men</Link>{menu === "mens" ? <hr/>:<></>}</li>
                <li onClick={() => {setMenu("womens")}}><Link style={{textDecoration: 'none'}}  to='womens'>Women</Link>{menu === "womens" ? <hr/>:<></>}</li>
                <li onClick={() => {setMenu("kids")}}><Link style={{textDecoration: 'none'}}  to='kids'>Kids</Link>{menu === "kids" ? <hr/>:<></>}</li>
            </ul>
            <div className='nav-login-cart'>
                
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>

                <div className="nav-info">
                {localStorage.getItem('auth-token') ?
                    <Link to= {(!isHaveAddr || !isHavePay) ? '/getinfo' : '/myinfo'}><img src={user_icon} alt=''/></Link> :
                    <Link to= '/login'><img src={guest_icon} alt=''/></Link>}
                </div>
                {localStorage.getItem('auth-token') ? 
                <button onClick={() => {
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem("selected-addr");
                    window.location.replace('/');
                }}>Logout
                </button> : 
                <Link to='/login'><button>Login</button></Link>
                }
            </div>

        </div>
    );
}


export default Navbar;