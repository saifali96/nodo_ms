const express = require("express");

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {

	return res.status(200).json({ success: true, message: "Hello from customers." });
});

app.listen(8001, () => {
	console.log("Customer service is listening on port 8001.");
})