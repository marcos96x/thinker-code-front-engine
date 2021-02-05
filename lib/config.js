const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = app => {
    app.set('port', '3001');

    // Configs de produção
    // app.set('trust proxy', 1) // trust first proxy
    // sess.cookie.secure = true // serve secure cookies
    // End Configs de produção

    app.use(bodyParser.json());
    app.use(cors({ origin: '*' }))
    
}