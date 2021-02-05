
const Route = require("./../helpers/route");
const router = new Route();

module.exports = app => {

    app.get('/', (req, res) => {
        router.setRoute('index2', app, res);
    })
    app.get('/teste', (req, res) => {
        router.setRoute('index1', app, res);
    })

    
}