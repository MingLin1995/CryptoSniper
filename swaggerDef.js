const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API with Swagger",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://crypto-sniper.minglin.vip/",
      description: "Local server",
    },
  ],
};

module.exports = swaggerDefinition;
