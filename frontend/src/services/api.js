const API_URL = "http://localhost:5000";


// ==================================================
// COMMON API FUNCTION
// ==================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type":
                    "application/json",

                ...(options.headers || {})
            }
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Something went wrong"
        );

    }


    return data;
}


// ==================================================
// FOODS
// ==================================================

export async function getFoods() {

    return await apiRequest(
        "/api/foods"
    );

}


// ==================================================
// RESTAURANTS
// ==================================================

export async function getRestaurants() {

    return await apiRequest(
        "/api/restaurants"
    );

}


// ==================================================
// REGISTER
// ==================================================

export async function registerUser(
    userData
) {

    return await apiRequest(
        "/api/register",
        {
            method: "POST",

            body:
                JSON.stringify(
                    userData
                )
        }
    );

}


// ==================================================
// LOGIN
// ==================================================

export async function loginUser(
    userData
) {

    return await apiRequest(
        "/api/login",
        {
            method: "POST",

            body:
                JSON.stringify(
                    userData
                )
        }
    );

}


// ==================================================
// CREATE ORDER
// ==================================================

export async function createOrder(
    orderData
) {

    return await apiRequest(
        "/api/orders",
        {
            method: "POST",

            body:
                JSON.stringify(
                    orderData
                )
        }
    );

}


// ==================================================
// GET ALL ORDERS
// ==================================================

export async function getOrders() {

    return await apiRequest(
        "/api/orders"
    );

}