import { useEffect, useState } from "react";


function AdminDashboard() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ------------------------------------------
    // FETCH ALL ORDERS
    // ------------------------------------------

    useEffect(() => {

        fetch("http://localhost:5000/api/orders")

            .then((response) => {

                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }

                return response.json();

            })

            .then((data) => {

                setOrders(data);
                setLoading(false);

            })

            .catch((error) => {

                console.log("Orders error:", error);

                setError(error.message);
                setLoading(false);

            });

    }, []);


    // ------------------------------------------
    // ORDER STATUS COUNTS
    // ------------------------------------------

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "Pending"
    ).length;

    const confirmedOrders = orders.filter(
        (order) => order.status === "Confirmed"
    ).length;

    const preparingOrders = orders.filter(
        (order) => order.status === "Preparing"
    ).length;

    const outForDeliveryOrders = orders.filter(
        (order) => order.status === "Out for Delivery"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
    ).length;


    // ------------------------------------------
    // UPDATE ORDER STATUS
    // ------------------------------------------

    const handleStatusChange = async (
        orderId,
        newStatus
    ) => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/orders/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update order status"
                );

            }


            setOrders((previousOrders) => {

                return previousOrders.map((order) => {

                    if (order._id === orderId) {

                        return {
                            ...order,
                            status: data.order.status
                        };

                    }

                    return order;

                });

            });


            console.log(
                "Order status updated successfully"
            );

        } catch (error) {

            console.log(
                "Status update error:",
                error
            );

            alert(
                error.message
            );

        }

    };


    // ------------------------------------------
    // GET NEXT STATUS
    // ------------------------------------------

    const getNextStatus = (currentStatus) => {

        const statusFlow = {

            "Pending": "Confirmed",

            "Confirmed": "Preparing",

            "Preparing": "Out for Delivery",

            "Out for Delivery": "Delivered"

        };


        return statusFlow[currentStatus] || null;

    };


    // ------------------------------------------
    // LOADING
    // ------------------------------------------

    if (loading) {

        return (
            <div className="admin-dashboard">

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Loading orders...
                </p>

            </div>
        );

    }


    // ------------------------------------------
    // ERROR
    // ------------------------------------------

    if (error) {

        return (
            <div className="admin-dashboard">

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Error: {error}
                </p>

            </div>
        );

    }


    // ------------------------------------------
    // DASHBOARD
    // ------------------------------------------

    return (

        <div className="admin-dashboard">

            <h1>
                Admin Dashboard
            </h1>

            <p className="admin-subtitle">
                Manage orders, track delivery status,
                and monitor your food delivery operations.
            </p>


            {/* -------------------------------- */}
            {/* STATISTICS */}
            {/* -------------------------------- */}

            <div className="admin-stats">

                <div className="stat-card">

                    <h3>
                        Total Orders
                    </h3>

                    <p>
                        {totalOrders}
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Pending
                    </h3>

                    <p>
                        {pendingOrders}
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Confirmed
                    </h3>

                    <p>
                        {confirmedOrders}
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Preparing
                    </h3>

                    <p>
                        {preparingOrders}
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Out for Delivery
                    </h3>

                    <p>
                        {outForDeliveryOrders}
                    </p>

                </div>


                <div className="stat-card">

                    <h3>
                        Delivered
                    </h3>

                    <p>
                        {deliveredOrders}
                    </p>

                </div>

            </div>


            {/* -------------------------------- */}
            {/* ORDERS TABLE */}
            {/* -------------------------------- */}

            <h2>
                Orders
            </h2>


            {orders.length === 0 ? (

                <p>
                    No orders found.
                </p>

            ) : (

                <div className="orders-table-container">

                    <table className="orders-table">

                        <thead>

                            <tr>

                                <th>
                                    Order ID
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Items
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Delivery Address
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {orders.map(
                                (order) => {

                                    const nextStatus =
                                        getNextStatus(
                                            order.status
                                        );


                                    return (

                                        <tr
                                            key={order._id}
                                        >

                                            {/* ORDER ID */}

                                            <td>
                                                {order._id}
                                            </td>


                                            {/* CUSTOMER NAME */}

                                            <td>
                                                {order.customerName ||
                                                    "Unknown Customer"}
                                            </td>


                                            {/* ITEMS */}

                                            <td>

                                                {order.items &&
                                                order.items.length > 0 ? (

                                                    <div>

                                                        {order.items.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (

                                                                <div
                                                                    key={index}
                                                                >

                                                                    {item.name ||
                                                                        item.title ||
                                                                        "Food"}{" "}

                                                                    ×{" "}

                                                                    {item.quantity ||
                                                                        1}

                                                                </div>

                                                            )
                                                        )}

                                                    </div>

                                                ) : (

                                                    "No items"

                                                )}

                                            </td>


                                            {/* AMOUNT */}

                                            <td>
                                                ₹
                                                {order.totalAmount}
                                            </td>


                                            {/* DELIVERY ADDRESS */}

                                            <td>
                                                {order.deliveryAddress}
                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                {nextStatus ? (

                                                    <select
                                                        value={
                                                            order.status
                                                        }

                                                        onChange={
                                                            (event) =>
                                                                handleStatusChange(
                                                                    order._id,
                                                                    event.target.value
                                                                )
                                                        }
                                                    >

                                                        <option
                                                            value={
                                                                order.status
                                                            }
                                                        >
                                                            {order.status}
                                                        </option>


                                                        <option
                                                            value={
                                                                nextStatus
                                                            }
                                                        >
                                                            Move to{" "}
                                                            {nextStatus}
                                                        </option>

                                                    </select>

                                                ) : (

                                                    <span
                                                        className={`admin-status-badge ${order.status
                                                            .toLowerCase()
                                                            .replaceAll(
                                                                " ",
                                                                "-"
                                                            )}`}
                                                    >
                                                        {order.status}
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
}


export default AdminDashboard;