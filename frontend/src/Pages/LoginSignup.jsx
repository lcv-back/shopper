import React, { useState } from "react";
import './CSS/LoginSignup.css';
import Notification from "../Components/Notification/Notification";

const LoginSigup = () => {
    const [state,setState] = useState("Login")

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })

    const [errors, setErrors] = useState({});
    const [notifi, setNotifi] =useState({message: "", status: false, show: false});

    const validateForm = () => {
        let newErrors = {};
        if(state === "Sign up" && (!formData.name.trim() || !formData.name)){
            newErrors.name = "Username is required.";
        }
        if(!formData.email.trim()){
            newErrors.email = "Email is required.";
        } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }
        if(formData.password.length < 3) {
            newErrors.password = "Password must be at least 3 characters.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async () => {
        if (!validateForm()) return;

        let responseData;
        await fetch(`http://localhost:4000/${state === "Login" ? "login" : "signup"}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => responseData = data);

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        } else {
            setNotifi({message: responseData.message||"Something went wrong.", status: false, show: true});
            setTimeout(()=> setNotifi({show: false}), 2000);
        }
    }

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign up" && (
                        <>
                            <input name="name" value={formData.name} onChange={changeHandler} type="text" placeholder="Your Name" />
                            {errors.name && <p className="text-red-600">{errors.name}</p>}
                        </>
                    )}
                    <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
                    {errors.email && <p className="text-red-600">{errors.email}</p>}
                    <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
                    {errors.password && <p className="text-red-600">{errors.password}</p>}
                </div>
                <button onClick={handleSubmit}>Continue</button>
                {state === "Sign up" ? (
                    <p className="loginsignup-login">Already have an account? <span onClick={() => setState("Login")}>Login here</span></p>
                ) : (
                    <p className="loginsignup-login">Create an account? <span onClick={() => setState("Sign up")}>Click here</span></p>
                )}
                <div className="loginsignup-agree">
                    <input type="checkbox" name="" id="" />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
            </div>
            {notifi.show && (<Notification message={notifi.message} status={notifi.status}/>)}
        </div>
    );
}

export default LoginSigup;