import { useState } from "react";

import {
    useSelector,
    useDispatch
} from "react-redux";

import { useNavigate } from "react-router-dom";

import { createOrder } from "../services/api";

import { clearCart } from "../store/cartSlice";


function Checkout() {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    const user = useSelector(
        (state) => state.auth.user
    );


    const items = useSelector(
        (state) => state.cart.items
    );


    const [address, setAddress] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const totalAmount = items.reduce(

        (total, item) =>

            total +
            Number(item.price) *
            item.quantity,

        0

    );


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");


        if (!user) {

            setError(
                "Please login before placing an order."
            );

            return;
        }


        if (items.length === 0) {

            setError(
                "Your cart is empty."
            );

            return;
        }


        if (!address.trim()) {

            setError(
                "Please enter your delivery address."
            );

            return;
        }


        try {

            setLoading(true);


            const orderData = {

                userId:
                    user.id ||
                    user._id,

                items:
                    items.map((item) => ({

                        foodId:
                            item._id,

                        name:
                            item.name,

                        price:
                            Number(item.price),

                        quantity:
                            item.quantity

                    })),

                totalAmount:
                    totalAmount,

                deliveryAddress:
                    address.trim()

            };


            await createOrder(
                orderData
            );


            dispatch(
                clearCart()
            );


            alert(
                "Order placed successfully!"
            );


            navigate("/orders");


        } catch (error) {

            console.log(
                "Order error:",
                error.message
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    }


    if (!user) {

        return (

            <div className="container checkout-page">

                <div className="checkout-login">

                    <div className="checkout-icon">
                        🔐
                    </div>

                    <h1>
                        Login Required
                    </h1>

                    <p>
                        Please login before
                        proceeding to checkout.
                    </p>

                </div>

            </div>

        );

    }


    if (items.length === 0) {

        return (

            <div className="container checkout-page">

                <div className="checkout-login">

                    <div className="checkout-icon">
                        🛒
                    </div>

                    <h1>
                        Your Cart is Empty
                    </h1>

                    <p>
                        Add some delicious food
                        before checking out.
                    </p>

                    <button
                        className="auth-button"
                        onClick={() =>
                            navigate("/foods")
                        }
                    >
                        Browse Foods
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="container checkout-page">

            <div className="page-header">

                <p className="page-tag">
                    📦 Almost There
                </p>

                <h1>
                    Checkout
                </h1>

                <p>
                    Enter your delivery details
                    to place your order.
                </p>

            </div>


            <div className="checkout-layout">

                <div className="checkout-form-card">

                    <h2>
                        Delivery Details
                    </h2>


                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="checkout-form"
                    >

                        <div className="form-group">

                            <label>
                                Delivery Address
                            </label>

                            <textarea
                                value={address}
                                onChange={(event) =>
                                    setAddress(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your complete delivery address"
                                rows="6"
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="place-order-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>

                    </form>

                </div>


                <div className="checkout-summary">

                    <h2>
                        Order Summary
                    </h2>


                    {items.map((item) => (

                        <div
                            className="checkout-item"
                            key={item._id}
                        >

                            <div>

                                <strong>
                                    {item.name}
                                </strong>

                                <p>
                                    ₹{item.price} ×{" "}
                                    {item.quantity}
                                </p>

                            </div>


                            <strong>
                                ₹
                                {Number(item.price) *
                                    item.quantity}
                            </strong>

                        </div>

                    ))}


                    <hr />


                    <div className="checkout-total">

                        <span>
                            Total
                        </span>

                        <span>
                            ₹{totalAmount}
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Checkout;