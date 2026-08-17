const http = require("http");

// ==========================================
// HELPER FUNCTION
// ==========================================

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


// ==========================================
// TEST CRUD
// ==========================================

async function testFoodCRUD() {

    try {

        // ======================================
        // 1. CREATE FOOD
        // ======================================

        console.log("\n1️⃣ CREATE FOOD");

        const createResponse =
            await request(
                "POST",
                "/api/foods",
                {
                    name: "Test Pizza",

                    price: 299,

                    category: "Pizza",

                    image: "test-pizza.jpg",

                    description:
                        "Pizza created through API"
                }
            );


        console.log(
            "Status:",
            createResponse.status
        );

        console.log(
            createResponse.data
        );


        if (
            createResponse.status !== 201
        ) {

            return;
        }


        const createdFood =
            createResponse.data.food;


        const foodId =
            createdFood.id;


        console.log(
            "Created Food ID:",
            foodId
        );


        // ======================================
        // 2. GET FOOD
        // ======================================

        console.log("\n2️⃣ GET FOOD");

        const getResponse =
            await request(
                "GET",
                `/api/foods/${foodId}`
            );


        console.log(
            "Status:",
            getResponse.status
        );

        console.log(
            getResponse.data
        );


        // ======================================
        // 3. UPDATE FOOD
        // ======================================

        console.log("\n3️⃣ UPDATE FOOD");

        const updateResponse =
            await request(
                "PUT",
                `/api/foods/${foodId}`,
                {

                    name:
                        "Updated Test Pizza",

                    price:
                        399

                }
            );


        console.log(
            "Status:",
            updateResponse.status
        );

        console.log(
            updateResponse.data
        );


        // ======================================
        // 4. GET UPDATED FOOD
        // ======================================

        console.log(
            "\n4️⃣ GET UPDATED FOOD"
        );


        const getUpdatedResponse =
            await request(
                "GET",
                `/api/foods/${foodId}`
            );


        console.log(
            "Status:",
            getUpdatedResponse.status
        );

        console.log(
            getUpdatedResponse.data
        );


        // ======================================
        // 5. DELETE FOOD
        // ======================================

        console.log("\n5️⃣ DELETE FOOD");

        const deleteResponse =
            await request(
                "DELETE",
                `/api/foods/${foodId}`
            );


        console.log(
            "Status:",
            deleteResponse.status
        );

        console.log(
            deleteResponse.data
        );


        // ======================================
        // 6. VERIFY DELETE
        // ======================================

        console.log(
            "\n6️⃣ VERIFY DELETE"
        );


        const verifyResponse =
            await request(
                "GET",
                `/api/foods/${foodId}`
            );


        console.log(
            "Status:",
            verifyResponse.status
        );

        console.log(
            verifyResponse.data
        );


        console.log(
            "\n✅ FOOD CRUD TEST COMPLETED"
        );


    } catch (error) {

        console.log(
            "\n❌ Test error:",
            error.message
        );

    }

}


// ==========================================
// START TEST
// ==========================================

testFoodCRUD();