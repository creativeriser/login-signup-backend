const route = require("express").Router()
// Notice we added 'logout' to the import list below!
const { login, register, logout, home, dashboard } = require("../Controller/Api")
const auth = require('../Middleware/auth')

route.post("/register", register);

route.post("/login", login);

// The new logout route!
route.post("/logout", logout);

route.get('/home', home)

route.get('/dashboard', auth, dashboard)

module.exports = route;
