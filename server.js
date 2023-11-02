const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

// import sequelize connection
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Set up Handlebars.js engine with custom helpers
const app = express();
const port = process.env.PORT || 3000;
// hbs is an instance of exphbs to create a handlebars object with custom helpers
const hbs = exphbs.create({ helpers });

// Set up sessions with cookies
const sess = {
    secret: 'Super secret secret',
    cookie: {
        // Stored in milliseconds (86400000 = 1 day)
        maxAge: 86400000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

// Add express-session and store as Express.js middleware
app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Express.js middleware to parse incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Turn on routes
app.use(routes);

// Turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => console.log(`Now listening on port localhost:${port}`));
});
