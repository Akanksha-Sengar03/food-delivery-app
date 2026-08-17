import { useDispatch, useSelector } from "react-redux";

import {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
} from "../store/cartSlice";

import { Link } from "react-router-dom";


function Cart() {

    const dispatch = useDispatch();

    const items = useSelector(
        (state) => state.cart.items
    );


    const total = items.reduce(
        (sum, item) =>
            sum +
            Number(item.price) *
            item.quantity,
        0
    );


    if (items.length === 0) {

        return (

            <div className="container empty-cart">

                <div className="empty-cart-icon">
                    🛒
                </div>

                <h1>
                    Your Cart is Empty
                </h1>

                <p>
                    Looks like you haven't added
                    anything to your cart yet.
                </p>

                <Link
                    to="/foods"
                    className="primary-button"
                >
                    Browse Foods
                </Link>

            </div>

        );

    }


    return (

        <div className="container cart-page">

            <div className="page-header">

                <p className="page-tag">
                    🛒 Your Order
                </p>

                <h1>
                    Your Cart
                </h1>

                <p>
                    Review your items before checkout.
                </p>

            </div>


            <div className="cart-layout">

                <div className="cart-items">

                    {items.map((item) => (

                        <div
                            className="cart-item-card"
                            key={item._id}
                        >

                            <div className="cart-item-image">

                                {item.image ? (

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />

                                ) : (

                                    <span>
                                        🍽️
                                    </span>

                                )}

                            </div>


                            <div className="cart-item-info">

                                <h2>
                                    {item.name}
                                </h2>

                                <p className="cart-category">
                                    {item.category}
                                </p>

                                <p className="cart-price">
                                    ₹{item.price}
                                </p>


                                <div className="cart-actions">

                                    <div className="quantity-control">

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    decreaseQuantity(
                                                        item._id
                                                    )
                                                )
                                            }
                                        >
                                            −
                                        </button>


                                        <span>
                                            {item.quantity}
                                        </span>


                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    increaseQuantity(
                                                        item._id
                                                    )
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>


                                    <button
                                        className="remove-button"
                                        onClick={() =>
                                            dispatch(
                                                removeFromCart(
                                                    item._id
                                                )
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>


                            <div className="cart-item-total">

                                ₹
                                {Number(item.price) *
                                    item.quantity}

                            </div>

                        </div>

                    ))}

                </div>


                <div className="cart-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="summary-row">

                        <span>
                            Items
                        </span>

                        <span>
                            {items.reduce(
                                (sum, item) =>
                                    sum +
                                    item.quantity,
                                0
                            )}
                        </span>

                    </div>


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{total}
                        </span>

                    </div>


                    <div className="summary-row">

                        <span>
                            Delivery
                        </span>

                        <span>
                            Free
                        </span>

                    </div>


                    <hr />


                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <span>
                            ₹{total}
                        </span>

                    </div>


                    <Link
                        to="/checkout"
                        className="checkout-button"
                    >
                        Proceed to Checkout
                    </Link>

                </div>

            </div>

        </div>

    );

}


export default Cart;