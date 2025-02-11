import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { signUp } from "../utils";
const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { store, dispatch } = useGlobalReducer()
    const [result, setResult] = useState('')

    const handleSubmit = async () => {
        if (email && password) {
            await signUp(dispatch)(email, password);
        } else {
            alert('Please input a valid email and password')
        }
    }

    useEffect(() => {
        if (store.signup_status === 201) {
            setResult('Account created successfully, go to the login page')
            setPassword('')
            setEmail('')
        } else if (store.signup_status === 400) {
            setResult('Something went wrong, email already in use')
        } else if (store.signup_status === 500) {
            setResult('Server error, try again later')
        }
    }, [store.signup_status])

    return (
        <div className="login">
            <div className="logForm">
                <div className="title">Create Account</div>
                <div className="d-flex justify-content-around">
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} placeholder="Type your email address..." onChange={(e) => setEmail(e.target.value)}></input>
                    <label htmlFor="Password">Password</label>
                    <input type="password" value={password} placeholder="Create a password..." onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <button onClick={handleSubmit}>Sign Up</button>

                <div className="fs-5">{result}</div>
            </div>
        </div>
    )
}

export default SignUp