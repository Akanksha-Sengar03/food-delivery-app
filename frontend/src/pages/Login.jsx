import { useState } from "react";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";

import { login } from "../store/authSlice";


function Login() {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        setLoading(true);


        try {

            const data =
                await loginUser({

                    email:
                        email,

                    password:
                        password

                });


            dispatch(
                login({

                    user:
                        data.user,

                    token:
                        data.token

                })
            );


            navigate("/");


        } catch (error) {

            setError(
                error.message
            );


        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <div className="auth-icon">
                        🍕
                    </div>

                    <h1>
                        Welcome Back!
                    </h1>

                    <p>
                        Login to continue
                        ordering delicious food.
                    </p>

                </div>


                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>

    );

}


export default Login;