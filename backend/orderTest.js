const http = require("http");


// ==========================================
// HELPER FUNCTION
// ==========================================

function request(method, path, data = null) {

    return new Promise((resolve, reject) => {

        const body = data
            ? JSON.stringify(data)
            : null;

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


        const req = http.request(
            options,
            (res) => {

                let responseData = "";


                res.on("data", (chunk) => {

                    responseData += chunk;

                });


                res.on("end", () => {

                    try {

                        resolve({
                            status: res.statusCode,
                            data: JSON.parse(responseData)
                        });

                    } catch {

                        resolve({
                            status: res.statusCode,
                            data: responseData
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
// CREATE ORDER
// ==========================================

async function testOrder() {

    try {

        console.log("\n================================");
        console.log("CREATE ORDER TEST");
        console.log("================================\n");


        const orderData = {

            userId: "test-user-123",

            items: [

                {
                    foodId: 1,
                    name: "Pizza",
                    price: 349,
                    quantity: 2
                },

                {
                    foodId: 2,
                    name: "Burger",
                    price: 199,
                    quantity: 1
                }

            ],

            totalAmount: 897,

            deliveryAddress:
                "Agra, Uttar Pradesh"

        };


        const response = await request(
            "POST",
            "/api/orders",
            orderData
        );


        console.log(
            "Status:",
            response.status
        );


        console.log("\nResponse:");

        console.log(
            JSON.stringify(
                response.data,
                null,
                2
            )
        );


        if (response.status === 201) {

            console.log(
                "\n✅ Order created successfully!"
            );

        } else {

            console.log(
                "\n❌ Order creation failed."
            );

        }


    } catch (error) {

        console.log(
            "\n❌ Error:",
            error.message
        );

    }

}


// ==========================================
// START TEST
// ==========================================

testOrder();