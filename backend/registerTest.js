const http = require("http");

const data = JSON.stringify({
    name: "Test User",
    email: "testuser2026@gmail.com",
    password: "Test@12345"
});

const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/register",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
    }
};

const request = http.request(options, (response) => {

    let body = "";

    response.on("data", (chunk) => {
        body += chunk;
    });

    response.on("end", () => {

        console.log("Status:", response.statusCode);

        console.log("Response:", body);

    });

});

request.on("error", (error) => {

    console.log("Request error:", error.message);

});

request.write(data);

request.end();