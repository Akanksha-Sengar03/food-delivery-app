// ==================================================
// FOOD ROUTES
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
// GET ALL FOODS
// GET /api/foods
// ==================================================

async function getFoods(
    req,
    res,
    db
) {

    try {

        const foods =
            await db
                .collection("foods")
                .find({})
                .sort({
                    createdAt: -1
                })
                .toArray();


        sendResponse(
            res,
            200,
            foods
        );


    } catch (error) {

        console.log(
            "Get foods error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to fetch foods"
            }
        );

    }
}


// ==================================================
// GET SINGLE FOOD
// GET /api/foods/:id
// ==================================================

async function getFoodById(
    req,
    res,
    db,
    id
) {

    try {

        const {
            ObjectId
        } = require("mongodb");


        let food = null;


        // ------------------------------------------
        // Try MongoDB ObjectId
        // ------------------------------------------

        if (
            ObjectId.isValid(id)
        ) {

            food =
                await db
                    .collection("foods")
                    .findOne({

                        _id:
                            new ObjectId(id)

                    });

        }


        // ------------------------------------------
        // Try numeric ID
        // ------------------------------------------

        if (!food) {

            food =
                await db
                    .collection("foods")
                    .findOne({

                        id:
                            Number(id)

                    });

        }


        if (!food) {

            sendResponse(
                res,
                404,
                {
                    message:
                        "Food not found"
                }
            );

            return;
        }


        sendResponse(
            res,
            200,
            food
        );


    } catch (error) {

        console.log(
            "Get food error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to fetch food"
            }
        );

    }
}


// ==================================================
// CREATE FOOD
// POST /api/foods
// ==================================================

async function createFood(
    req,
    res,
    db,
    data
) {

    try {

        const {
            name,
            price,
            category,
            image,
            description
        } = data;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !name ||
            price === undefined ||
            !category
        ) {

            sendResponse(
                res,
                400,
                {
                    message:
                        "Name, price and category are required"
                }
            );

            return;
        }


        // ------------------------------------------
        // CREATE FOOD
        // ------------------------------------------

        const newFood = {

            name:
                name,

            price:
                Number(price),

            category:
                category,

            image:
                image || "",

            description:
                description || "",

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
                .collection("foods")
                .insertOne(
                    newFood
                );


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        sendResponse(
            res,
            201,
            {

                message:
                    "Food created successfully",

                food: {

                    _id:
                        result.insertedId,

                    ...newFood

                }

            }
        );


    } catch (error) {

        console.log(
            "Create food error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to create food"
            }
        );

    }
}


// ==================================================
// UPDATE FOOD
// PUT /api/foods/:id
// ==================================================

async function updateFood(
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


        let filter;


        // ------------------------------------------
        // ObjectId
        // ------------------------------------------

        if (
            ObjectId.isValid(id)
        ) {

            filter = {

                _id:
                    new ObjectId(id)

            };

        } else {

            filter = {

                id:
                    Number(id)

            };

        }


        // ------------------------------------------
        // UPDATE DATA
        // ------------------------------------------

        const updateData = {};


        if (
            data.name !== undefined
        ) {

            updateData.name =
                data.name;

        }


        if (
            data.price !== undefined
        ) {

            updateData.price =
                Number(data.price);

        }


        if (
            data.category !== undefined
        ) {

            updateData.category =
                data.category;

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


        // ------------------------------------------
        // UPDATE DATABASE
        // ------------------------------------------

        const result =
            await db
                .collection("foods")
                .updateOne(

                    filter,

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
                        "Food not found"
                }
            );

            return;
        }


        // ------------------------------------------
        // GET UPDATED FOOD
        // ------------------------------------------

        const updatedFood =
            await db
                .collection("foods")
                .findOne(
                    filter
                );


        sendResponse(
            res,
            200,
            {

                message:
                    "Food updated successfully",

                food:
                    updatedFood

            }
        );


    } catch (error) {

        console.log(
            "Update food error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to update food"
            }
        );

    }
}


// ==================================================
// DELETE FOOD
// DELETE /api/foods/:id
// ==================================================

async function deleteFood(
    req,
    res,
    db,
    id
) {

    try {

        const {
            ObjectId
        } = require("mongodb");


        let filter;


        // ------------------------------------------
        // ObjectId
        // ------------------------------------------

        if (
            ObjectId.isValid(id)
        ) {

            filter = {

                _id:
                    new ObjectId(id)

            };

        } else {

            filter = {

                id:
                    Number(id)

            };

        }


        // ------------------------------------------
        // DELETE
        // ------------------------------------------

        const result =
            await db
                .collection("foods")
                .deleteOne(
                    filter
                );


        if (
            result.deletedCount === 0
        ) {

            sendResponse(
                res,
                404,
                {
                    message:
                        "Food not found"
                }
            );

            return;
        }


        sendResponse(
            res,
            200,
            {

                message:
                    "Food deleted successfully"

            }
        );


    } catch (error) {

        console.log(
            "Delete food error:",
            error.message
        );


        sendResponse(
            res,
            500,
            {
                message:
                    "Failed to delete food"
            }
        );

    }
}


// ==================================================
// EXPORT
// ==================================================

module.exports = {

    getFoods,

    getFoodById,

    createFood,

    updateFood,

    deleteFood

};