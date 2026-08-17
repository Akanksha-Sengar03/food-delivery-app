// ==================================================
// RESTAURANT ROUTES
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
// GET ALL RESTAURANTS
// GET /api/restaurants
// ==================================================

async function getRestaurants(
    req,
    res,
    db
) {

    try {

        const restaurants =
            await db
                .collection("restaurants")
                .find({})
                .sort({
                    createdAt: -1
                })
                .toArray();


        sendResponse(
            res,
            200,
            restaurants
        );

    } catch (error) {

        console.log(
            "Get restaurants error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to fetch restaurants"
            }
        );

    }
}


// ==================================================
// GET SINGLE RESTAURANT
// GET /api/restaurants/:id
// ==================================================

async function getRestaurantById(
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
                        "Invalid restaurant ID"
                }
            );

            return;
        }


        const restaurant =
            await db
                .collection("restaurants")
                .findOne({

                    _id:
                        new ObjectId(id)

                });


        if (!restaurant) {

            sendResponse(
                res,
                404,
                {
                    message:
                        "Restaurant not found"
                }
            );

            return;
        }


        sendResponse(
            res,
            200,
            restaurant
        );

    } catch (error) {

        console.log(
            "Get restaurant error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to fetch restaurant"
            }
        );

    }
}


// ==================================================
// CREATE RESTAURANT
// POST /api/restaurants
// ==================================================

async function createRestaurant(
    req,
    res,
    db,
    data
) {

    try {

        const {
            name,
            category,
            address,
            image,
            description
        } = data;


        if (
            !name ||
            !category ||
            !address
        ) {

            sendResponse(
                res,
                400,
                {
                    message:
                        "Name, category and address are required"
                }
            );

            return;
        }


        const newRestaurant = {

            name:
                name,

            category:
                category,

            address:
                address,

            image:
                image || "",

            description:
                description || "",

            createdAt:
                new Date(),

            updatedAt:
                new Date()

        };


        const result =
            await db
                .collection("restaurants")
                .insertOne(
                    newRestaurant
                );


        sendResponse(
            res,
            201,
            {

                message:
                    "Restaurant created successfully",

                restaurant: {

                    _id:
                        result.insertedId,

                    ...newRestaurant

                }

            }
        );

    } catch (error) {

        console.log(
            "Create restaurant error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to create restaurant"
            }
        );

    }
}


// ==================================================
// UPDATE RESTAURANT
// PUT /api/restaurants/:id
// ==================================================

async function updateRestaurant(
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
                        "Invalid restaurant ID"
                }
            );

            return;
        }


        const updateData = {};


        if (
            data.name !== undefined
        ) {

            updateData.name =
                data.name;

        }


        if (
            data.category !== undefined
        ) {

            updateData.category =
                data.category;

        }


        if (
            data.address !== undefined
        ) {

            updateData.address =
                data.address;

        }


        if (
            data.image !== undefined
        ) {

            updateData.image =
                data.image;

        }


        if (
            data.description !== undefined
        ) {

            updateData.description =
                data.description;

        }


        updateData.updatedAt =
            new Date();


        const result =
            await db
                .collection("restaurants")
                .updateOne(

                    {
                        _id:
                            new ObjectId(id)
                    },

                    {
                        $set:
                            updateData
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
                        "Restaurant not found"
                }
            );

            return;
        }


        const updatedRestaurant =
            await db
                .collection("restaurants")
                .findOne({

                    _id:
                        new ObjectId(id)

                });


        sendResponse(
            res,
            200,
            {

                message:
                    "Restaurant updated successfully",

                restaurant:
                    updatedRestaurant

            }
        );

    } catch (error) {

        console.log(
            "Update restaurant error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to update restaurant"
            }
        );

    }
}


// ==================================================
// DELETE RESTAURANT
// DELETE /api/restaurants/:id
// ==================================================

async function deleteRestaurant(
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
                        "Invalid restaurant ID"
                }
            );

            return;
        }


        const result =
            await db
                .collection("restaurants")
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
                        "Restaurant not found"
                }
            );

            return;
        }


        sendResponse(
            res,
            200,
            {
                message:
                    "Restaurant deleted successfully"
            }
        );

    } catch (error) {

        console.log(
            "Delete restaurant error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to delete restaurant"
            }
        );

    }
}


// ==================================================
// EXPORT
// ==================================================

module.exports = {

    getRestaurants,

    getRestaurantById,

    createRestaurant,

    updateRestaurant,

    deleteRestaurant

};