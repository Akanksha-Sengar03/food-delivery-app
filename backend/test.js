const http = require("http");

const data = JSON.stringify({
    name: "Akanksha",
    food: "Pizza"
});

const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/test",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
    }
};

const request = http.request(options, (response) => {

    let responseData = "";

    response.on("data", (chunk) => {
        responseData += chunk;
    });

    response.on("end", () => {
        console.log("Status:", response.statusCode);
        console.log("Response:", responseData);
    });
});

request.on("error", (error) => {
    console.log("Error:", error.message);
});

request.write(data);
request.end();