const app = require("./src/router");

const DEFAULT_PORT = 8000;

const main = function (providedPort) {
  const port = providedPort || DEFAULT_PORT;
  app.listen(port, () => console.log(`listening on ${port}...`));
};

main(+process.argv[2]);
