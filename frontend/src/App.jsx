import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useSelector } from "react-redux";


import Home from "./pages/Home";
import Foods from "./pages/Foods";
import Restaurants from "./pages/Restaurants";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";


// ==================================================
// PROTECTED ADMIN ROUTE
// ==================================================

function ProtectedAdminRoute({
    children
}) {

    const user =
        useSelector(
            (state) =>
                state.auth.user
        );


    // ------------------------------------------
    // CHECK ADMIN
    // ------------------------------------------

    if (
        !user ||
        user.role !== "admin"
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // ------------------------------------------
    // ADMIN ALLOWED
    // ------------------------------------------

    return children;

}


// ==================================================
// APP
// ==================================================

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* HOME */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* FOODS */}

                <Route
                    path="/foods"
                    element={<Foods />}
                />


                {/* RESTAURANTS */}

                <Route
                    path="/restaurants"
                    element={<Restaurants />}
                />


                {/* CART */}

                <Route
                    path="/cart"
                    element={<Cart />}
                />


                {/* CHECKOUT */}

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />


                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* REGISTER */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* MY ORDERS */}

                <Route
                    path="/orders"
                    element={<Orders />}
                />


                {/* ==================================
                    PROTECTED ADMIN DASHBOARD
                   ================================== */}

                <Route
                    path="/admin"
                    element={

                        <ProtectedAdminRoute>

                            <AdminDashboard />

                        </ProtectedAdminRoute>

                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;