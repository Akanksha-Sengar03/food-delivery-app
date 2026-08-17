import { Link } from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import { logout } from "../store/authSlice";


function Navbar() {

    const dispatch = useDispatch();


    const user = useSelector(
        (state) => state.auth.user
    );


    const cartItems = useSelector(
        (state) => state.cart.items
    );


    const cartCount = cartItems.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    function handleLogout() {

        dispatch(
            logout()
        );

    }


    return (

        <nav className="main-navbar">

            <Link
                to="/"
                className="navbar-logo"
            >
                🍕 Food Delivery
            </Link>


            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>


                <Link to="/foods">
                    Foods
                </Link>


                <Link to="/restaurants">
                    Restaurants
                </Link>


                <Link
                    to="/cart"
                    className="cart-link"
                >
                    🛒 Cart
                    <span className="cart-badge">
                        {cartCount}
                    </span>
                </Link>


                {user ? (

                    <>

                        <Link to="/orders">
                            My Orders
                        </Link>


                        <span className="welcome-user">
                            Hi, {user.name}
                        </span>


                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </>

                ) : (

                    <>

                        <Link
                            to="/login"
                            className="login-link"
                        >
                            Login
                        </Link>


                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Register
                        </Link>

                    </>

                )}

            </div>

        </nav>

    );

}


export default Navbar;