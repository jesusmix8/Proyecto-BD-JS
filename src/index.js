const express = require('express');
const morgan = require('morgan');
const app = express();

const cors = require('cors');
const path = require('path');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



const routesClient = require('./routes/client.routes');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('src'));
app.use('/static', express.static(path.join(__dirname, 'views')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(routesClient);



app.listen(3000);
console.log('Server on port', 3000);