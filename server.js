const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//turn on routes
app.use(routes);

//turn on connection to db and server 
//"sync" part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!
//The other thing to notice is the use of {force: false} in the .sync() method. This doesn't have to be included, but if it were set to true, it would drop and re-create all of the database tables on startup.
//if changed to true it drops database and restarts Module 13.3.5
sequelize.sync({ force: false}).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

