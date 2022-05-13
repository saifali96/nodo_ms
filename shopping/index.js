const express = require("express");

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {

	return res.status(200).json({ success: true, message: "Hello from shopping." });
});

app.listen(8003, () => {
	console.log("Shopping service is listening on port 8003.");
})