import { Cancel, Room } from '@material-ui/icons';
import axios from 'axios';
import { useRef, useState } from 'react';

import './register.css';

export default function Register({setShowRegister}) {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            await axios.post("http://localhost:8800/api/users/register", newUser);
            setError(false);
            setSuccess(true);
        } catch (err) {
            setError(true);
            setSuccess(false);
        }
    }

    return (
        <div className="registerContainer">
            <div className="registerLogo">
                <Room />
                TravelMap
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef} />
                <input type="email" placeholder="email" ref={emailRef} />
                <input type="password" placeholder="password" ref={passwordRef} />
                <button className="registerBtn">Register</button>

                {
                    success && (
                        <span className="success">Successfull. You can login now!</span>
                    )
                }
                
                {
                    error && (
                        <span className="failure">Something went wrong!</span>
                    )
                }
            </form>

            <Cancel className="registerCancel" onClick={() => setShowRegister(false)} />
        </div>
    )
}