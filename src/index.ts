import polka from "polka";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { resolve } from "path";
import { readdirSync, statSync } from "fs";

import { gauge } from "./datadog";

const app = polka();

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

function registerRoutes(app: polka.Polka, routeDir: string, basePath = "") {
  const files = readdirSync(routeDir);

  files.forEach((file) => {
    const fullPath = resolve(routeDir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      registerRoutes(app, fullPath, `${basePath}/${file}`);
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      const routePath = `${basePath}/${file.replace(/.(j|t)s$/, "")}`;
      const handler = require(fullPath).default;

      if (typeof handler === "function") {
        app.get(routePath, async (req, res) => {
          try {
            gauge(
              `api.${routePath.replace(/\//g, "_").replace(/^_/, "")}.requests`,
              1
            );
            const resp = await handler(req, res);
            const respStr =
              typeof resp === "string" ? resp : JSON.stringify(resp);

            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(respStr);
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Internal server error" }));
          }
        });
      }
    }
  });
}

registerRoutes(app, resolve(__dirname, "routes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
