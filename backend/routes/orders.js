// ==================================================
// ORDER ROUTES
// Native Node.js + MongoDB
// NO EXPRESS
// ==================================================


// ==================================================
// HELPER: SEND RESPONSE
// ==================================================

function sendResponse(
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
// CREATE ORDER
// POST /api/orders
// ==================================================

async function createOrder(
    req,
    res,
    db,
    data
) {

    try {

        const {
            userId,
            items,
            totalAmount,
            deliveryAddress
        } = data;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !userId ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0 ||
            totalAmount === undefined ||
            !deliveryAddress
        ) {

            sendResponse(
                res,
                400,
                {
                    message:
                        "userId, items, totalAmount and deliveryAddress are required"
                }
            );

            return;
        }


        // ------------------------------------------
        // CREATE ORDER
        // ------------------------------------------

        const newOrder = {

            userId:
                userId,

            items:
                items,

            totalAmount:
                Number(totalAmount),

            deliveryAddress:
                deliveryAddress,

            status:
                "Pending",

            paymentStatus:
                "Pending",

            createdAt:
                new Date(),

            updatedAt:
                new Date()

        };


        // ------------------------------------------
        // SAVE TO MONGODB
        // ------------------------------------------

        const result =
            await db
                .collection("orders")
                .insertOne(
                    newOrder
                );


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        sendResponse(
            res,
            201,
            {

                message:
                    "Order created successfully",

                order: {

                    _id:
                        result.insertedId,

                    ...newOrder

                }

            }
        );


    } catch (error) {

        console.log(
            "Create order error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to create order"
            }
        );

    }
}


// ==================================================
// GET ALL ORDERS
// GET /api/orders
// ==================================================

async function getOrders(
    req,
    res,
    db
) {

    try {

        // ------------------------------------------
        // GET ALL ORDERS
        // ------------------------------------------

        const orders =
            await db
                .collection("orders")
                .find({})
                .sort({
                    createdAt: -1
                })
                .toArray();


        // ------------------------------------------
        // USERS COLLECTION
        // ------------------------------------------

        const usersCollection =
            db.collection("users");


        // ------------------------------------------
        // ADD CUSTOMER NAME TO EACH ORDER
        // ------------------------------------------

        const ordersWithCustomerName =
            await Promise.all(

                orders.map(
                    async (order) => {

                        let customerName =
                            "Unknown Customer";


                        try {

                            const {
                                ObjectId
                            } = require("mongodb");


                            // Check whether userId
                            // is a valid MongoDB ObjectId

                            if (
                                ObjectId.isValid(
                                    order.userId
                                )
                            ) {

                                const user =
                                    await usersCollection.findOne(

                                        {
                                            _id:
                                                new ObjectId(
                                                    order.userId
                                                )
                                        },

                                        {
                                            projection: {
                                                name: 1
                                            }
                                        }

                                    );


                                if (
                                    user &&
                                    user.name
                                ) {

                                    customerName =
                                        user.name;

                                }

                            }

                        } catch (error) {

                            console.log(
                                "Customer lookup error:",
                                error.message
                            );

                        }


                        return {

                            ...order,

                            customerName:
                                customerName

                        };

                    }
                )

            );


        // ------------------------------------------
        // SEND ORDERS
        // ------------------------------------------

        sendResponse(
            res,
            200,
            ordersWithCustomerName
        );


    } catch (error) {

        console.log(
            "Get orders error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to fetch orders"
            }
        );

    }
}


// ==================================================
// GET USER ORDERS
// GET /api/orders/user/:userId
// ==================================================

async function getUserOrders(
    req,
    res,
    db,
    userId
) {

    try {

        const orders =
            await db
                .collection("orders")
                .find({
                    userId:
                        userId
                })
                .sort({
                    createdAt: -1
                })
                .toArray();


        sendResponse(
            res,
            200,
            orders
        );


    } catch (error) {

        console.log(
            "Get user orders error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to fetch user orders"
            }
        );

    }
}


// ==================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// ==================================================

async function getOrderById(
    req,
    res,
    db,
    id
) {

    try {

        const {
            ObjectId
        } = require("mongodb");


        if (
            !ObjectId.isValid(id)
        ) {

            sendResponse(
                res,
                400,
                {
                    message:
                        "Invalid order ID"
                }
            );

            return;
        }


        const order =
            await db
                .collection("orders")
                .findOne({

                    _id:
                        new ObjectId(id)

                });


        if (!order) {

            sendResponse(
                res,
                404,
                {
                    message:
                        "Order not found"
                }
            );

            return;
        }


        sendResponse(
            res,
            200,
            order
        );


    } catch (error) {

        console.log(
            "Get order error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to fetch order"
            }
        );

    }
}


// ==================================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// ==================================================

async function updateOrderStatus(
    req,
    res,
    db,
    id,
    data
) {

    try {

        const {
            ObjectId
        } = require("mongodb");


        if (
            !ObjectId.isValid(id)
        ) {

            sendResponse(
                res,
                400,
                {
                    message:
                        "Invalid order ID"
                }
            );

            return;
        }


        const {
            status
        } = data;


        if (!status) {

            sendResponse(
                res,
                400,
                {
                    message:
                        "Status is required"
                }
            );

            return;
        }


        const allowedStatuses = [

            "Pending",

            "Confirmed",

            "Preparing",

            "Out for Delivery",

            "Delivered",

            "Cancelled"

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            sendResponse(
                res,
                400,
                {
                    message:
                        "Invalid order status"
                }
            );

            return;
        }


        const result =
            await db
                .collection("orders")
                .updateOne(

                    {
                        _id:
                            new ObjectId(id)
                    },

                    {
                        $set: {

                            status:
                                status,

                            updatedAt:
                                new Date()

                        }
                    }

                );


        if (
            result.matchedCount === 0
        ) {

            sendResponse(
                res,
                404,
                {
                    message:
                        "Order not found"
                }
            );

            return;
        }


        const updatedOrder =
            await db
                .collection("orders")
                .findOne({

                    _id:
                        new ObjectId(id)

                });


        sendResponse(
            res,
            200,
            {

                message:
                    "Order status updated successfully",

                order:
                    updatedOrder

            }
        );


    } catch (error) {

        console.log(
            "Update order status error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to update order status"
            }
        );

    }
}


// ==================================================
// DELETE ORDER
// DELETE /api/orders/:id
// ==================================================

async function deleteOrder(
    req,
    res,
    db,
    id
) {

    try {

        const {
            ObjectId
        } = require("mongodb");


        if (
            !ObjectId.isValid(id)
        ) {

            sendResponse(
                res,
                400,
                {
                    message:
                        "Invalid order ID"
                }
            );

            return;
        }


        const result =
            await db
                .collection("orders")
                .deleteOne({

                    _id:
                        new ObjectId(id)

                });


        if (
            result.deletedCount === 0
        ) {

            sendResponse(
                res,
                404,
                {
                    message:
                        "Order not found"
                }
            );

            return;
        }


        sendResponse(
            res,
            200,
            {
                message:
                    "Order deleted successfully"
            }
        );


    } catch (error) {

        console.log(
            "Delete order error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to delete order"
            }
        );

    }
}


// ==================================================
// EXPORT
// ==================================================

module.exports = {

    createOrder,

    getOrders,

    getUserOrders,

    getOrderById,

    updateOrderStatus,

    deleteOrder

};