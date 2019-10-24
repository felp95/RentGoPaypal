const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const njk = require('nunjucks')
const path = require('path')

const routes = require('./routes')

class App {
    constructor() {
        this.express = express();

        this.middlewares();
        this.views();
        this.routes();
    }

    middlewares() {
        njk.configure('views', {
            autoescape: true,
            express: this.express,
            watch: true
        })

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());
    }

    views() {
        njk.configure(path.resolve(__dirname, 'views'), {
            watch: this.isDev,
            express: this.express,
            autoescape: true
        })

        this.express.use(express.static(path.resolve(__dirname, 'public')))

        this.express.set('view engine', 'njk')
    }

    routes() {
        this.express.use(routes);
    }
}

module.exports = new App().express