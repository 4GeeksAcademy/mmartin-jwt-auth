import React, { useState, useEffect } from "react";
import { logIn } from "../utils";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import keyImg from '../assets/img/key.png'


const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { store, dispatch } = useGlobalReducer()
    const goTo = useNavigate()

    const handleSubmit = async () => {
        if (email && password) {
            await logIn(dispatch)(email, password)
        }
        else {
            alert('Please input a valid email and password')
        }
    }
    const handleCreate = () => {
        goTo('/signup')
    }
    useEffect(() => {
        if (store.login && store.secrets) {
            goTo('/dashboard')
        }
    }, [dispatch, store.secrets]);
    return (
        <div className="login">
            <div className="logForm">
                <div className="title">Login</div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} placeholder="Type your email address..." onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor="Password">Password</label>
                <input type="password" id="password" value={password} placeholder="Type your password..." onChange={(e) => setPassword(e.target.value)}></input>
                <div className="buttonSet">
                    <button onClick={handleSubmit}>Sign In</button>
                    <div>or</div>
                    <button onClick={handleCreate}>Create an Account</button>
                </div>
            </div>

            <div>

            </div>
        </div>
    )
}

export default Login