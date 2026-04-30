import { createApp } from "./app";
import { env } from "./config/env";
import { connectDB } from "./db/connect";
import { logger } from "./utils/logger";

async function bootstrap() {
  await connectDB();

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    logger.info(`📚 Swagger docs on http://localhost:${env.PORT}/docs`);
  });
}

bootstrap();
