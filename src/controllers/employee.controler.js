const pool = require('../db');

const inicio = (req, res) => {
    res.sendFile("views/inicio/index.html", { root: __dirname + "/../" });
}

module.exports = {
    inicio
}