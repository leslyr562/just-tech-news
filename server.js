const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3002;
const hbs = exphbs.create({ helpers });

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//This code sets up an Express.js session
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};


//This code connects the session to our Sequelize database.
app.use(session(sess));

// const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


//express middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//adding folder through express.static middleware gets connect and serves as static assets
//built-in Express.js middleware function that can take all of the contents of a folder and 
//serve them as static assets. This is useful for front-end specific files like images, style sheets, and JavaScript files.
app.use(express.static(path.join(__dirname, 'public')));


//turn on routes
app.use(require('./controllers'));


//turn on connection to db and server 
//"sync" part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!
//The other thing to notice is the use of {force: false} in the .sync() method. This doesn't have to be included, but if it were set to true, it would drop and re-create all of the database tables on startup.
//if changed to true it drops database and restarts Module 13.3.5
sequelize.sync({ force: false}).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

