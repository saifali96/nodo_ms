const ShoppingService = require("../services/shopping-service");
const UserAuth = require('./middlewares/auth');
const { PublishMessage, SubscribeMessage } = require("../utils");

const { MSQ_BROKER_CUSTOMER_BINDING_KEY } = require("../config");

module.exports = (app, channel) => {
	
	const service = new ShoppingService();
	SubscribeMessage(channel, service);

	app.post('/order', UserAuth, async (req,res,next) => {

		const { _id } = req.user;
		const { txnNumber } = req.body;


		try {
			const { data } = await service.PlaceOrder({_id, txnNumber});

			const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");
			
			PublishMessage(channel, MSQ_BROKER_CUSTOMER_BINDING_KEY, JSON.stringify(payload.data));
			return res.status(200).json({ success: true, message: data });
			
		} catch (err) {
			next(err);
		}

	});

	app.get('/orders', UserAuth, async (req,res,next) => {

		try {
			const { data } = await service.GetOrders(req.user._id);
			return res.status(200).json({ success: true, message: data });
		} catch (err) {
			next(err);
		}

	});
	   
	
	app.get('/cart', UserAuth, async (req,res,next) => {

		try {
			const { data } = await service.getCart(req.user._id);
			return res.status(200).json({ success: true, message: data });
		} catch (err) {
			next(err);
		}
	});
}