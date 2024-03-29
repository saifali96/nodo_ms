const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const amqplib = require("amqplib");

const { APP_SECRET, MSG_BROKER_URL, MSG_BROKER_EXCHANGE, MSG_BROKER_QUEUE, MSQ_BROKER_CUSTOMER_BINDING_KEY } = require('../config');

//Utility functions
module.exports.GenerateSalt = async() => {
		return await bcrypt.genSalt();
},

module.exports.GeneratePassword = async (password) => {
		return await bcrypt.hash(password, await this.GenerateSalt());
};


module.exports.ValidatePassword = async (enteredPassword, savedPassword) => {
		return await bcrypt.compare(enteredPassword, savedPassword);
};

module.exports.GenerateSignature = async (payload) => {
		return await jwt.sign(payload, APP_SECRET, { expiresIn: '1d'} )
}, 

module.exports.ValidateSignature  = async(req) => {

		const signature = req.get('Authorization');
		
		if(signature){
			const payload = await jwt.verify(signature, APP_SECRET);
			req.user = payload;
			return true;
		}

		return false
};

module.exports.FormatData = (data) => {
		if(data){
			return { data }
		} else {
			throw new Error('Data Not found!')
		}
	}


// Message broker

// Create a channel
module.exports.createChannel = async() => {

	try {
		
		const connection = await amqplib.connect(MSG_BROKER_URL);
		const channel = await connection.createChannel();
		await channel.assertExchange(MSG_BROKER_EXCHANGE, "direct", false);
	
		console.log("Connected to RabbitMQ.");
		return channel;
	} catch (error) {
		throw error;
	}
}

// Subscribe to the messaging queue
module.exports.SubscribeMessage = async (channel, service) => {

	const appQueue = await channel.assertQueue(MSG_BROKER_QUEUE);

	channel.bindQueue(appQueue.queue, MSG_BROKER_EXCHANGE, MSQ_BROKER_CUSTOMER_BINDING_KEY);

	channel.consume(appQueue.queue, data => {
		console.log("Customer Message Queue Received Data:");
		console.log(data.content.toString());

		service.SubscribeEvents(data.content.toString());
		channel.ack(data);
	});

}
