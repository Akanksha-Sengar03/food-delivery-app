import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { getOrders } from "../services/api";


function Orders() {

    const user = useSelector(
        (state) => state.auth.user
    );


    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadOrders();

    }, []);


    async function loadOrders() {

        try {

            setLoading(true);

            setError("");


            const data =
                await getOrders();


            if (user) {

                const userId =
                    user.id ||
                    user._id;


                const userOrders =
                    data.filter(
                        (order) =>
                            order.userId ===
                            userId
                    );


                setOrders(
                    userOrders
                );

            } else {

                setOrders([]);

            }


        } catch (error) {

            console.log(
                "Orders error:",
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

            <div className="container">

                <div className="orders-message">

                    <div className="orders-icon">
                        🔐
                    </div>

                    <h1>
                        Login Required
                    </h1>

                    <p>
                        Please login to view
                        your orders.
                    </p>

                </div>

            </div>

        );

    }


    if (loading) {

        return (

            <div className="container">

                <div className="page-header">

                    <p className="page-tag">
                        📦 Order History
                    </p>

                    <h1>
                        My Orders
                    </h1>

                </div>

                <div className="loading">
                    Loading orders...
                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="container">

                <div className="page-header">

                    <p className="page-tag">
                        📦 Order History
                    </p>

                    <h1>
                        My Orders
                    </h1>

                </div>

                <div className="error-box">

                    <h3>
                        Unable to load orders
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={loadOrders}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="container orders-page">

            <div className="page-header">

                <p className="page-tag">
                    📦 Order History
                </p>

                <h1>
                    My Orders
                </h1>

                <p>
                    Track and review your
                    previous orders.
                </p>

            </div>


            {orders.length === 0 ? (

                <div className="orders-message">

                    <div className="orders-icon">
                        🛍️
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        You haven't placed any
                        orders yet.
                    </p>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order._id}
                        >

                            <div className="order-header">

                                <div>

                                    <p className="order-label">
                                        Order ID
                                    </p>

                                    <h2>
                                        #{String(
                                            order._id
                                        ).slice(-8)}
                                    </h2>

                                </div>


                                <span
                                    className={`order-status ${String(
                                        order.status
                                    )
                                        .toLowerCase()
                                        .replaceAll(
                                            " ",
                                            "-"
                                        )}`}
                                >
                                    {order.status}
                                </span>

                            </div>


                            <div className="order-details">

                                <div className="order-detail">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹{order.totalAmount}
                                    </strong>

                                </div>


                                <div className="order-detail">

                                    <span>
                                        Payment
                                    </span>

                                    <strong>
                                        {order.paymentStatus}
                                    </strong>

                                </div>


                                <div className="order-detail">

                                    <span>
                                        Delivery Address
                                    </span>

                                    <strong>
                                        {order.deliveryAddress}
                                    </strong>

                                </div>

                            </div>


                            {order.items &&
                                order.items.length > 0 && (

                                    <div className="order-items">

                                        <h3>
                                            Items
                                        </h3>


                                        {order.items.map(
                                            (item, index) => (

                                                <div
                                                    className="order-item"
                                                    key={
                                                        item.foodId ||
                                                        index
                                                    }
                                                >

                                                    <span>
                                                        {item.name}
                                                        {" × "}
                                                        {item.quantity}
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            item.price
                                                        ) *
                                                            item.quantity}
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}


export default Orders;