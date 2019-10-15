const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes')

class App {
    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());
    }

    routes() {
        this.express.use(routes);
    }
}

module.exports = new App().express