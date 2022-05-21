const dotEnv  = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
    const configFile =  process.env.NODE_ENV ? `./.${process.env.NODE_ENV}.env` : `./.dev.env`;
    dotEnv.config({ path:  configFile });
} else {
    dotEnv.config();
}

module.exports = {

    PORT: process.env.PORT,
    DB_URL: process.env.MONGO_URI,
    APP_SECRET: process.env.JWT_SECRET,
	MSG_BROKER_URL: process.env.MSG_BROKER_URL,
    MSG_BROKER_EXCHANGE: process.env.MSG_BROKER_EXCHANGE,
    MSG_BROKER_QUEUE: process.env.MSG_BROKER_QUEUE,
    MSQ_BROKER_CUSTOMER_BINDING_KEY: process.env.MSQ_BROKER_CUSTOMER_BINDING_KEY
}
 