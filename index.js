const express = require('express');
const consign = require('consign');
const path = require('path');


const app = express();
app.use(express.static(path.join(__dirname, '/views/')));
app.set('views', __dirname + '/views/pages');
app.set('components', __dirname + '/views/components');
app.set('css', __dirname + '/views/css');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
consign()
    .then('lib/config.js')
    .then('src/routes')
    .then('lib/boot.js')
    .into(app);