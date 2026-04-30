"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const connect_1 = require("./db/connect");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    await (0, connect_1.connectDB)();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`🚀 Server running on http://localhost:${env_1.env.PORT}`);
        logger_1.logger.info(`📚 Swagger docs on http://localhost:${env_1.env.PORT}/docs`);
    });
}
bootstrap();
