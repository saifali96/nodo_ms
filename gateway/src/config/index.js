const dotEnv  = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
    const configFile =  process.env.NODE_ENV ? `./.${process.env.NODE_ENV}.env` : `./.dev.env`;
    dotEnv.config({ path:  configFile });
} else {
    dotEnv.config();
}

module.exports = {

    PORT: process.env.PORT,
    MS_CUSTOMER_URL: process.env.MS_CUSTOMER_URL,
    MS_PRODUCTS_URL: process.env.MS_PRODUCTS_URL,
    MS_SHOPPING_URL: process.env.MS_SHOPPING_URL
}
 