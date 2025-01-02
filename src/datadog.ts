import https from "https";

export const gauge = (metricName: string, value: number) => {
  const data = JSON.stringify({
    series: [
      {
        metric: metricName,
        points: [[Math.floor(Date.now() / 1000), value]],
        tags: ["env:production"],
        type: "gauge",
      },
    ],
  });

  const req = https.request(
    {
      hostname: "api.datadoghq.com",
      path: "/api/v1/series",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "DD-API-KEY": process.env.DD_API_KEY || "",
      },
    },
    (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log("Metric sent:", res.statusCode);
      });
    }
  );

  req.on("error", console.error);
  req.write(data);
  req.end();
};
