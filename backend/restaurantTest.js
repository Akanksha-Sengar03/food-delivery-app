const http = require("http");


// ==================================================
// HELPER FUNCTION
// ==================================================

function request(method, path, data = null) {

    return new Promise((resolve, reject) => {

        const body =
            data ? JSON.stringify(data) : null;

        const options = {

            hostname: "localhost",

            port: 5000,

            path: path,

            method: method,

            headers: {
                "Content-Type": "application/json"
            }
        };


        if (body) {

            options.headers["Content-Length"] =
                Buffer.byteLength(body);

        }


        const req =
            http.request(
                options,
                (res) => {

                    let responseData = "";


                    res.on("data", (chunk) => {

                        responseData += chunk;

                    });


                    res.on("end", () => {

                        try {

                            resolve({

                                status:
                                    res.statusCode,

                                data:
                                    JSON.parse(responseData)

                            });

                        } catch {

                            resolve({

                                status:
                                    res.statusCode,

                                data:
                                    responseData

                            });

                        }

                    });

                }
            );


        req.on("error", (error) => {

            reject(error);

        });


        if (body) {

            req.write(body);

        }


        req.end();

    });

}


// ==================================================
// RESTAURANT CRUD TEST
// ==================================================

async function testRestaurantCRUD() {

    try {

        console.log(
            "\n================================="
        );

        console.log(
            "RESTAURANT CRUD TEST STARTED"
        );

        console.log(
            "=================================\n"
        );


        // ==========================================
        // 1. CREATE RESTAURANT
        // ==========================================

        console.log(
            "1. Creating restaurant...\n"
        );


        const createResponse =
            await request(

                "POST",

                "/api/restaurants",

                {

                    name:
                        "Test Restaurant",

                    description:
                        "A test restaurant",

                    image:
                        "test-restaurant.jpg",

                    address:
                        "Agra, Uttar Pradesh",

                    category:
                        "Indian"

                }

            );


        console.log(
            "Status:",
            createResponse.status
        );


        console.log(
            JSON.stringify(
                createResponse.data,
                null,
                2
            )
        );


        if (
            createResponse.status !== 201
        ) {

            console.log(
                "\n❌ Restaurant creation failed."
            );

            return;
        }


        const restaurantId =
            createResponse.data
                .restaurant
                ._id;


        console.log(
            "\n✅ Restaurant created."
        );


        console.log(
            "Restaurant ID:",
            restaurantId
        );


        // ==========================================
        // 2. GET ALL RESTAURANTS
        // ==========================================

        console.log(
            "\n---------------------------------"
        );

        console.log(
            "2. Getting all restaurants..."
        );

        console.log(
            "---------------------------------\n"
        );


        const allResponse =
            await request(

                "GET",

                "/api/restaurants"

            );


        console.log(
            "Status:",
            allResponse.status
        );


        console.log(
            JSON.stringify(
                allResponse.data,
                null,
                2
            )
        );


        // ==========================================
        // 3. GET SINGLE RESTAURANT
        // ==========================================

        console.log(
            "\n---------------------------------"
        );

        console.log(
            "3. Getting single restaurant..."
        );

        console.log(
            "---------------------------------\n"
        );


        const singleResponse =
            await request(

                "GET",

                `/api/restaurants/${restaurantId}`

            );


        console.log(
            "Status:",
            singleResponse.status
        );


        console.log(
            JSON.stringify(
                singleResponse.data,
                null,
                2
            )
        );


        // ==========================================
        // 4. UPDATE RESTAURANT
        // ==========================================

        console.log(
            "\n---------------------------------"
        );

        console.log(
            "4. Updating restaurant..."
        );

        console.log(
            "---------------------------------\n"
        );


        const updateResponse =
            await request(

                "PUT",

                `/api/restaurants/${restaurantId}`,

                {

                    name:
                        "Updated Test Restaurant",

                    category:
                        "North Indian"

                }

            );


        console.log(
            "Status:",
            updateResponse.status
        );


        console.log(
            JSON.stringify(
                updateResponse.data,
                null,
                2
            )
        );


        // ==========================================
        // 5. GET UPDATED RESTAURANT
        // ==========================================

        console.log(
            "\n---------------------------------"
        );

        console.log(
            "5. Getting updated restaurant..."
        );

        console.log(
            "---------------------------------\n"
        );


        const updatedResponse =
            await request(

                "GET",

                `/api/restaurants/${restaurantId}`

            );


        console.log(
            "Status:",
            updatedResponse.status
        );


        console.log(
            JSON.stringify(
                updatedResponse.data,
                null,
                2
            )
        );


        // ==========================================
        // 6. DELETE RESTAURANT
        // ==========================================

        console.log(
            "\n---------------------------------"
        );

        console.log(
            "6. Deleting restaurant..."
        );

        console.log(
            "---------------------------------\n"
        );


        const deleteResponse =
            await request(

                "DELETE",

                `/api/restaurants/${restaurantId}`

            );


        console.log(
            "Status:",
            deleteResponse.status
        );


        console.log(
            JSON.stringify(
                deleteResponse.data,
                null,
                2
            )
        );


        // ==========================================
        // COMPLETE
        // ==========================================

        console.log(
            "\n================================="
        );

        console.log(
            "✅ RESTAURANT CRUD TEST COMPLETED"
        );

        console.log(
            "=================================\n"
        );


    } catch (error) {

        console.log(
            "\n❌ TEST ERROR:"
        );

        console.log(
            error.message
        );

    }

}


// ==================================================
// START TEST
// ==================================================

testRestaurantCRUD();