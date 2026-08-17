const http = require("http");

const BASE_URL = "http://localhost:5000";


// ==================================================
// HELPER: SEND HTTP REQUEST
// ==================================================

function request(method, path, data = null) {

    return new Promise((resolve, reject) => {

        const options = {
            hostname: "localhost",
            port: 5000,
            path: path,
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        const req = http.request(options, (res) => {

            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {

                let parsedBody;

                try {
                    parsedBody = JSON.parse(body);
                } catch {
                    parsedBody = body;
                }

                resolve({
                    status: res.statusCode,
                    data: parsedBody
                });
            });
        });

        req.on("error", (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}


// ==================================================
// MAIN TEST
// ==================================================

async function testOrderCRUD() {

    try {

        console.log("\n=================================");
        console.log("ORDER CRUD TEST STARTED");
        console.log("=================================\n");


        // ==================================================
        // 1. CREATE ORDER
        // POST /api/orders
        // ==================================================

        console.log("1. Creating test order...\n");

        const createResponse = await request(
            "POST",
            "/api/orders",
            {
                userId: "crud-test-user",

                items: [
                    {
                        foodId: 1,
                        name: "Pizza",
                        price: 349,
                        quantity: 1
                    },
                    {
                        foodId: 2,
                        name: "Burger",
                        price: 199,
                        quantity: 2
                    }
                ],

                totalAmount: 747,

                deliveryAddress: "Agra, Uttar Pradesh"
            }
        );

        console.log("Status:", createResponse.status);
        console.log(
            JSON.stringify(createResponse.data, null, 2)
        );


        if (createResponse.status !== 201) {

            console.log("\n❌ Order creation failed.");
            return;
        }


        // Get newly created order ID

        const orderId =
            createResponse.data.order._id;

        console.log("\n✅ Order created.");
        console.log("Order ID:", orderId);


        // ==================================================
        // 2. GET ALL ORDERS
        // GET /api/orders
        // ==================================================

        console.log("\n---------------------------------");
        console.log("2. Getting all orders...");
        console.log("---------------------------------\n");

        const allOrdersResponse =
            await request(
                "GET",
                "/api/orders"
            );

        console.log(
            "Status:",
            allOrdersResponse.status
        );

        console.log(
            JSON.stringify(
                allOrdersResponse.data,
                null,
                2
            )
        );


        // ==================================================
        // 3. GET SINGLE ORDER
        // GET /api/orders/:id
        // ==================================================

        console.log("\n---------------------------------");
        console.log("3. Getting single order...");
        console.log("---------------------------------\n");

        const singleOrderResponse =
            await request(
                "GET",
                `/api/orders/${orderId}`
            );

        console.log(
            "Status:",
            singleOrderResponse.status
        );

        console.log(
            JSON.stringify(
                singleOrderResponse.data,
                null,
                2
            )
        );


        // ==================================================
        // 4. GET USER ORDERS
        // GET /api/orders/user/:userId
        // ==================================================

        console.log("\n---------------------------------");
        console.log("4. Getting user orders...");
        console.log("---------------------------------\n");

        const userOrdersResponse =
            await request(
                "GET",
                "/api/orders/user/crud-test-user"
            );

        console.log(
            "Status:",
            userOrdersResponse.status
        );

        console.log(
            JSON.stringify(
                userOrdersResponse.data,
                null,
                2
            )
        );


        // ==================================================
        // 5. UPDATE ORDER STATUS
        // PUT /api/orders/:id/status
        // ==================================================

        console.log("\n---------------------------------");
        console.log("5. Updating order status...");
        console.log("---------------------------------\n");

        const updateResponse =
            await request(
                "PUT",
                `/api/orders/${orderId}/status`,
                {
                    status: "Confirmed"
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


        // ==================================================
        // 6. DELETE ORDER
        // DELETE /api/orders/:id
        // ==================================================

        console.log("\n---------------------------------");
        console.log("6. Deleting test order...");
        console.log("---------------------------------\n");

        const deleteResponse =
            await request(
                "DELETE",
                `/api/orders/${orderId}`
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


        // ==================================================
        // FINISHED
        // ==================================================

        console.log("\n=================================");
        console.log("✅ ORDER CRUD TEST COMPLETED");
        console.log("=================================\n");


    } catch (error) {

        console.log("\n❌ TEST ERROR:");
        console.log(error.message);

    }
}


// ==================================================
// START TEST
// ==================================================

testOrderCRUD();