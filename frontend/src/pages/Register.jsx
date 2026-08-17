import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";


function Register() {

    const navigate = useNavigate();


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);


        try {

            await registerUser({

                name:
                    name,

                email:
                    email,

                password:
                    password

            });


            setSuccess(
                "Registration successful!"
            );


            setTimeout(() => {

                navigate("/login");

            }, 1000);


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
                        🍔
                    </div>

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Join us and start ordering
                        delicious food.
                    </p>

                </div>


                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="auth-success">
                        {success}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    <div className="form-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your name"
                            required
                        />

                    </div>


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
                            ? "Creating Account..."
                            : "Register"}
                    </button>

                </form>

            </div>

        </div>

    );

}


export default Register;