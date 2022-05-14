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
    APP_SECRET: process.env.JWT_SECRET
}
 