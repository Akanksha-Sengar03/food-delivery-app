require("dotenv").config();

const http = require("http");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ==================================================
// FOOD ROUTES
// ==================================================

const {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
} = require("./routes/foods");


// ==================================================
// ORDER ROUTES
// ==================================================

const {
    createOrder,
    getOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require("./routes/orders");


// ==================================================
// RESTAURANT ROUTES
// ==================================================

const {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require("./routes/restaurants");


// ==================================================
// CONFIGURATION
// ==================================================

const PORT = 5000;

const MONGODB_URI =
    process.env.MONGODB_URI;

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "food-delivery-secret-key";


// ==================================================
// MONGODB
// ==================================================

const client =
    new MongoClient(MONGODB_URI);

let db;

let usersCollection;


// ==================================================
// SEND JSON RESPONSE
// ==================================================

function sendJSON(
    res,
    statusCode,
    data
) {

    res.writeHead(
        statusCode,
        {
            "Content-Type":
                "application/json",

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Methods":
                "GET, POST, PUT, DELETE, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type, Authorization"
        }
    );


    res.end(
        JSON.stringify(data)
    );

}


// ==================================================
// READ REQUEST BODY
// ==================================================

function getRequestBody(req) {

    return new Promise(
        (resolve, reject) => {

            let body = "";


            req.on(
                "data",
                (chunk) => {

                    body += chunk;

                }
            );


            req.on(
                "end",
                () => {

                    try {

                        const data =
                            body
                                ? JSON.parse(body)
                                : {};


                        resolve(data);

                    } catch (error) {

                        reject(
                            new Error(
                                "Invalid JSON"
                            )
                        );

                    }

                }
            );


            req.on(
                "error",
                (error) => {

                    reject(error);

                }
            );

        }
    );

}


// ==================================================
// REGISTER USER
// POST /api/register
// ==================================================

async function registerUser(
    req,
    res
) {

    try {

        const data =
            await getRequestBody(req);


        const {
            name,
            email,
            password
        } = data;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !name ||
            !email ||
            !password
        ) {

            sendJSON(
                res,
                400,
                {
                    message:
                        "Name, email and password are required"
                }
            );

            return;

        }


        if (
            password.length < 6
        ) {

            sendJSON(
                res,
                400,
                {
                    message:
                        "Password must be at least 6 characters"
                }
            );

            return;

        }


        // ------------------------------------------
        // CHECK EXISTING USER
        // ------------------------------------------

        const existingUser =
            await usersCollection.findOne(
                {
                    email:
                        email.toLowerCase()
                }
            );


        if (existingUser) {

            sendJSON(
                res,
                409,
                {
                    message:
                        "Email already registered"
                }
            );

            return;

        }


        // ------------------------------------------
        // HASH PASSWORD
        // ------------------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ------------------------------------------
        // CREATE USER
        // ------------------------------------------

        const newUser = {

            name:
                name,

            email:
                email.toLowerCase(),

            password:
                hashedPassword,

            createdAt:
                new Date(),

            // New users are customers
            // by default

            role:
                "customer"

        };


        // ------------------------------------------
        // SAVE USER
        // ------------------------------------------

        const result =
            await usersCollection.insertOne(
                newUser
            );


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        sendJSON(
            res,
            201,
            {

                message:
                    "User registered successfully",

                user: {

                    id:
                        result.insertedId,

                    name:
                        name,

                    email:
                        email.toLowerCase(),

                    role:
                        "customer"

                }

            }
        );


    } catch (error) {

        console.log(
            "Register error:",
            error.message
        );


        sendJSON(
            res,
            500,
            {
                message:
                    "Server error"
            }
        );

    }

}


// ==================================================
// LOGIN USER
// POST /api/login
// ==================================================

async function loginUser(
    req,
    res
) {

    try {

        const data =
            await getRequestBody(req);


        const {
            email,
            password
        } = data;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !email ||
            !password
        ) {

            sendJSON(
                res,
                400,
                {
                    message:
                        "Email and password are required"
                }
            );

            return;

        }


        // ------------------------------------------
        // FIND USER
        // ------------------------------------------

        const user =
            await usersCollection.findOne(
                {
                    email:
                        email.toLowerCase()
                }
            );


        if (!user) {

            sendJSON(
                res,
                401,
                {
                    message:
                        "Invalid email or password"
                }
            );

            return;

        }


        // ------------------------------------------
        // VERIFY PASSWORD
        // ------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            sendJSON(
                res,
                401,
                {
                    message:
                        "Invalid email or password"
                }
            );

            return;

        }


        // ------------------------------------------
        // GET ROLE
        // ------------------------------------------

        const userRole =
            user.role || "customer";


        // ------------------------------------------
        // CREATE JWT
        // ------------------------------------------

        const token =
            jwt.sign(

                {

                    userId:
                        user._id.toString(),

                    email:
                        user.email,

                    role:
                        userRole

                },

                JWT_SECRET,

                {

                    expiresIn:
                        "7d"

                }

            );


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        sendJSON(
            res,
            200,
            {

                message:
                    "Login successful",

                token:
                    token,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        userRole

                }

            }
        );


    } catch (error) {

        console.log(
            "Login error:",
            error.message
        );


        sendJSON(
            res,
            500,
            {
                message:
                    "Server error"
            }
        );

    }

}


// ==================================================
// CREATE SERVER
// ==================================================

const server =
    http.createServer(
        async (req, res) => {

            try {


                // ==================================
                // CORS PREFLIGHT
                // ==================================

                if (
                    req.method ===
                    "OPTIONS"
                ) {

                    res.writeHead(
                        204,
                        {

                            "Access-Control-Allow-Origin":
                                "*",

                            "Access-Control-Allow-Methods":
                                "GET, POST, PUT, DELETE, OPTIONS",

                            "Access-Control-Allow-Headers":
                                "Content-Type, Authorization"

                        }
                    );


                    res.end();

                    return;

                }


                // ==================================
                // HOME
                // ==================================

                if (
                    req.method === "GET" &&
                    req.url === "/"
                ) {

                    sendJSON(
                        res,
                        200,
                        {

                            message:
                                "Food Delivery Backend is Running!"

                        }
                    );


                    return;

                }


                // ==================================
                // REGISTER
                // ==================================

                if (
                    req.method === "POST" &&
                    req.url === "/api/register"
                ) {

                    await registerUser(
                        req,
                        res
                    );


                    return;

                }


                // ==================================
                // LOGIN
                // ==================================

                if (
                    req.method === "POST" &&
                    req.url === "/api/login"
                ) {

                    await loginUser(
                        req,
                        res
                    );


                    return;

                }


                // ==================================
                // USERS
                // GET /api/users
                // ==================================

                if (
                    req.method === "GET" &&
                    req.url === "/api/users"
                ) {

                    const users =
                        await usersCollection
                            .find({})
                            .project(
                                {
                                    password: 0
                                }
                            )
                            .toArray();


                    sendJSON(
                        res,
                        200,
                        users
                    );


                    return;

                }


                // ==================================
                // FOOD ROUTES
                // ==================================


                // ----------------------------------
                // GET ALL FOODS
                // GET /api/foods
                // ----------------------------------

                if (
                    req.method === "GET" &&
                    req.url === "/api/foods"
                ) {

                    await getFoods(
                        req,
                        res,
                        db
                    );


                    return;

                }


                // ----------------------------------
                // GET SINGLE FOOD
                // GET /api/foods/:id
                // ----------------------------------

                if (
                    req.method === "GET" &&
                    req.url.startsWith(
                        "/api/foods/"
                    )
                ) {

                    const id =
                        req.url.split("/")[3];


                    await getFoodById(
                        req,
                        res,
                        db,
                        id
                    );


                    return;

                }


                // ----------------------------------
                // CREATE FOOD
                // POST /api/foods
                // ----------------------------------

                if (
                    req.method === "POST" &&
                    req.url === "/api/foods"
                ) {

                    const data =
                        await getRequestBody(req);


                    await createFood(
                        req,
                        res,
                        db,
                        data
                    );


                    return;

                }


                // ----------------------------------
                // UPDATE FOOD
                // PUT /api/foods/:id
                // ----------------------------------

                if (
                    req.method === "PUT" &&
                    req.url.startsWith(
                        "/api/foods/"
                    )
                ) {

                    const id =
                        req.url.split("/")[3];


                    const data =
                        await getRequestBody(req);


                    await updateFood(
                        req,
                        res,
                        db,
                        id,
                        data
                    );


                    return;

                }


                // ----------------------------------
                // DELETE FOOD
                // DELETE /api/foods/:id
                // ----------------------------------

                if (
                    req.method === "DELETE" &&
                    req.url.startsWith(
                        "/api/foods/"
                    )
                ) {

                    const id =
                        req.url.split("/")[3];


                    await deleteFood(
                        req,
                        res,
                        db,
                        id
                    );


                    return;

                }


                // ==================================
                // RESTAURANT ROUTES
                // ==================================


                // ----------------------------------
                // GET ALL RESTAURANTS
                // GET /api/restaurants
                // ----------------------------------

                if (
                    req.method === "GET" &&
                    req.url === "/api/restaurants"
                ) {

                    await getRestaurants(
                        req,
                        res,
                        db
                    );


                    return;

                }


                // ----------------------------------
                // GET SINGLE RESTAURANT
                // GET /api/restaurants/:id
                // ----------------------------------

                if (
                    req.method === "GET" &&
                    req.url.startsWith(
                        "/api/restaurants/"
                    )
                ) {

                    const id =
                        req.url.split("/")[3];


                    await getRestaurantById(
                        req,
                        res,
                        db,
                        id
                    );


                    return;

                }


                // ----------------------------------
                // CREATE RESTAURANT
                // POST /api/restaurants
                // ----------------------------------

                if (
                    req.method === "POST" &&
                    req.url === "/api/restaurants"
                ) {

                    const data =
                        await getRequestBody(req);


                    await createRestaurant(
                        req,
                        res,
                        db,
                        data
                    );


                    return;

                }


                // ----------------------------------
                // UPDATE RESTAURANT
                // PUT /api/restaurants/:id
                // ----------------------------------

                if (
                    req.method === "PUT" &&
                    req.url.startsWith(
                        "/api/restaurants/"
                    )
                ) {

                    const id =
                        req.url.split("/")[3];


                    const data =
                        await getRequestBody(req);


                    await updateRestaurant(
                        req,
                        res,
                        db,
                        id,
                        data
                    );


                    return;

                }


                // ----------------------------------
                // DELETE RESTAURANT
                // DELETE /api/restaurants/:id
                // ----------------------------------

                if (
                    req.method === "DELETE" &&
                    req.url.startsWith(
                        "/api/restaurants/"
                    )
                ) {

                    const id =
                        req.url.split("/")[3];


                    await deleteRestaurant(
                        req,
                        res,
                        db,
                        id
                    );


                    return;

                }


                // ==================================
                // ORDER ROUTES
                // ==================================


                // ----------------------------------
                // CREATE ORDER
                // POST /api/orders
                // ----------------------------------

                if (
                    req.method === "POST" &&
                    req.url === "/api/orders"
                ) {

                    const data =
                        await getRequestBody(req);


                    await createOrder(
                        req,
                        res,
                        db,
                        data
                    );


                    return;

                }


                // ----------------------------------
                // GET ALL ORDERS
                // GET /api/orders
                // ----------------------------------

                if (
                    req.method === "GET" &&
                    req.url === "/api/orders"
                ) {

                    await getOrders(
                        req,
                        res,
                        db
                    );


                    return;

                }


                // ----------------------------------
                // GET USER ORDERS
                // GET /api/orders/user/:userId
                // ----------------------------------

                if (
                    req.method === "GET" &&
                    req.url.startsWith(
                        "/api/orders/user/"
                    )
                ) {

                    const userId =
                        req.url.split("/")[4];


                    await getUserOrders(
                        req,
                        res,
                        db,
                        userId
                    );


                    return;

                }


                // ----------------------------------
                // UPDATE ORDER STATUS
                // PUT /api/orders/:id/status
                // ----------------------------------

                if (
                    req.method === "PUT" &&
                    req.url.startsWith(
                        "/api/orders/"
                    ) &&
                    req.url.endsWith(
                        "/status"
                    )
                ) {

                    const parts =
                        req.url.split("/");


                    const orderId =
                        parts[3];


                    const data =
                        await getRequestBody(req);


                    await updateOrderStatus(
                        req,
                        res,
                        db,
                        orderId,
                        data
                    );


                    return;

                }


                // ----------------------------------
                // GET SINGLE ORDER
                // GET /api/orders/:id
                // ----------------------------------

                if (
                    req.method === "GET" &&
                    req.url.startsWith(
                        "/api/orders/"
                    )
                ) {

                    const orderId =
                        req.url.split("/")[3];


                    await getOrderById(
                        req,
                        res,
                        db,
                        orderId
                    );


                    return;

                }


                // ----------------------------------
                // DELETE ORDER
                // DELETE /api/orders/:id
                // ----------------------------------

                if (
                    req.method === "DELETE" &&
                    req.url.startsWith(
                        "/api/orders/"
                    )
                ) {

                    const orderId =
                        req.url.split("/")[3];


                    await deleteOrder(
                        req,
                        res,
                        db,
                        orderId
                    );


                    return;

                }


                // ==================================
                // 404
                // ==================================

                sendJSON(
                    res,
                    404,
                    {
                        message:
                            "Route not found"
                    }
                );


            } catch (error) {

                console.log(
                    "Server error:",
                    error.message
                );


                sendJSON(
                    res,
                    500,
                    {
                        message:
                            "Internal server error"
                    }
                );

            }

        }
    );


// ==================================================
// START SERVER
// ==================================================

async function startServer() {

    try {

        // ------------------------------------------
        // CONNECT MONGODB
        // ------------------------------------------

        await client.connect();


        console.log(
            "MongoDB Atlas connected successfully!"
        );


        // ------------------------------------------
        // SELECT DATABASE
        // ------------------------------------------

        db =
            client.db(
                "foodDelivery"
            );


        // ------------------------------------------
        // USERS COLLECTION
        // ------------------------------------------

        usersCollection =
            db.collection(
                "users"
            );


        // ------------------------------------------
        // UNIQUE EMAIL INDEX
        // ------------------------------------------

        await usersCollection.createIndex(

            {
                email: 1
            },

            {
                unique: true
            }

        );


        // ------------------------------------------
        // START SERVER
        // ------------------------------------------

        server.listen(
            PORT,
            () => {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );

            }
        );


    } catch (error) {

        console.log(
            "MongoDB connection error:"
        );


        console.log(
            error.message
        );

    }

}


// ==================================================
// START APPLICATION
// ==================================================

startServer();