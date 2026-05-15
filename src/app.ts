import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import path from "path";

import { env } from "./config/env";
import { logger } from "./utils/logger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

import { healthRouter } from "./modules/health/health.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { vendorRouter } from "./modules/vendor/vendors.routes";
import { productRouter } from "./modules/product/product.routes";
import { categoryRouter } from "./modules/category/category.routes";
import { adOnRouter } from "./modules/adOns/adOns.routes";
import { orderRouter } from "./modules/order/order.routes";
import { riderRouter } from "./modules/rider/rider.routes";
import { addressRouter } from "./modules/userAddress/userAddress.routes";
import { bankDetailRouter } from "./modules/bankDetail/bankDetail.routes";
import { settingRouter } from "./modules/settings/settings.routes";

// ✅ JSON swagger import
import swaggerDoc from "./docs/swagger.json";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(pinoHttp({ logger }));

  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
      credentials: true
    })
  );

  // Allow frontend to load images/files served from /uploads without CORP blocking.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    "/uploads",
    (req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join(process.cwd(), "uploads"))
  );

  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  // (removed duplicate cors() middleware)

  // ✅ Swagger (JSON)
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api", vendorRouter, riderRouter, productRouter, categoryRouter, adOnRouter, orderRouter, addressRouter, bankDetailRouter, settingRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
