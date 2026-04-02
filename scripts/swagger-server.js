const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const swaggerPath = path.join(__dirname, '..', 'docs', 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.SWAGGER_PORT || 8081;
app.listen(port, () => {
  console.log(`Swagger UI available at http://localhost:${port}/docs`);
});
