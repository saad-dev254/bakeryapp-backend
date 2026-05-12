"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const notFound_1 = require("./middlewares/notFound");
const errorHandler_1 = require("./middlewares/errorHandler");
const health_routes_1 = require("./modules/health/health.routes");
const auth_routes_1 = require("./modules/auth/auth.routes");
const vendors_routes_1 = require("./modules/vendor/vendors.routes");
const product_routes_1 = require("./modules/product/product.routes");
const category_routes_1 = require("./modules/category/category.routes");
const adOns_routes_1 = require("./modules/adOns/adOns.routes");
const shipment_routes_1 = require("./modules/shipment/shipment.routes");
const country_routes_1 = require("./modules/country/country.routes");
const delivery_routes_1 = require("./modules/deliver-services/delivery.routes");
const city_routes_1 = require("./modules/city/city.routes");
// ✅ JSON swagger import
const swagger_json_1 = __importDefault(require("./docs/swagger.json"));
const order_routes_1 = require("./modules/order/order.routes");
const rider_routes_1 = require("./modules/rider/rider.routes");
const userAddress_routes_1 = require("./modules/userAddress/userAddress.routes");
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use((0, pino_http_1.default)({ logger: logger_1.logger }));
    app.use((0, cors_1.default)({
        origin: env_1.env.CORS_ORIGIN === "*" ? true : env_1.env.CORS_ORIGIN,
        credentials: true
    }));
    // Allow frontend to load images/files served from /uploads without CORP blocking.
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/uploads", (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    }, express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
    app.use((0, express_rate_limit_1.default)({
        windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
        max: env_1.env.RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false
    }));
    // (removed duplicate cors() middleware)
    // ✅ Swagger (JSON)
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    app.use("/api/health", health_routes_1.healthRouter);
    app.use("/api/auth", auth_routes_1.authRouter);
    app.use("/api", vendors_routes_1.vendorRouter, rider_routes_1.riderRouter, product_routes_1.productRouter, category_routes_1.categoryRouter, adOns_routes_1.adOnRouter, order_routes_1.orderRouter, userAddress_routes_1.addressRouter, shipment_routes_1.shipmentRouter, country_routes_1.countryRouter, delivery_routes_1.deliveryRouter, city_routes_1.cityRouter);
    app.use(notFound_1.notFound);
    app.use(errorHandler_1.errorHandler);
    return app;
}
