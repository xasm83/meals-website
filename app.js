let express = require('express');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
let passport = require('passport');
let session = require('cookie-session');
let flash = require('connect-flash');
let Acl = require('acl');
let path = require('path');
let LocalStrategy = require('passport-local').Strategy;

let MealService = require('./meals/mealService').MealService;
let MealsAdminService = require('./meals/mealsAdminService').MealsAdminService;
let LoginService = require('./login/loginService').LoginService;
let SettingsService = require('./settings/settingsService').SettingsService;

MongoClient.connect("mongodb://localhost:27017/mealDatabase", {w: 'majority'}, function (err, db) {

    let mealService = new MealService(db);
    let mealAdminService = new MealsAdminService(db);
    let settingsService = new SettingsService(db);
    let loginService = new LoginService(db);

    let app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(session({
        secret: 'something',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false}
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('views', './client');
    app.use('/static', express.static(path.join(__dirname, 'client')));

    //passport js auth config
    //cant pass  loginService.authenticate directly because of this binding
    passport.use('login',
        new LocalStrategy((username, password, done) => {
            loginService.authenticate(username, password, done);
        })
    );
    passport.use('signup',
        new LocalStrategy((username, password, done) => {
            loginService.createUser(username, password, (err, user, message) => {
                if (user) {
                    settingsService.saveSettings(username, {username, calories: 0}, (err) => {
                        done(err, !err ? user : false, !err ? "User created successfully" : "Error saving settings");
                    })
                } else {
                    done(err, user, message);
                }
            });
        })
    );
    passport.serializeUser((user, done) => {
        loginService.serialize(user, done);
    });
    passport.deserializeUser((username, done) => {
        loginService.deserialize(username, done);
    });


    //hardcoded roles backend
    let acl = new Acl(new Acl.mongodbBackend(db, "acl_"));
    acl.allow([
        {
            roles: 'admin_role',
            allows: [{resources: '/api/admin/meals', permissions: '*'},
                {resources: '/api/roles/add', permissions: '*'},
                {resources: '/api/roles/remove', permissions: '*'}]
        }
    ]);
    acl.addUserRoles('admin', 'admin_role');
    let aclMiddleware = acl.middleware(3, (req, res) => {
        return req.user.username;
    });
    app.get('/roles', isAuthenticated, (req, res) => {
        acl.hasRole(req.user.username, "admin_role", (err, result) => {
            res.json({isAdmin: result});
        })
    });

    // Setting a new role
    app.get('/api/roles/add', isAuthenticated, aclMiddleware, function (request, response, next) {
        acl.addUserRoles(request.query.user, request.query.role, (err) => {
            response.send(request.query.user + ' is a ' + request.query.role);
        });
    });

    // Unsetting a role
    app.get('/api/roles/remove', isAuthenticated, aclMiddleware, function (request, response, next) {
        acl.removeUserRoles(request.query.user, request.query.role, (err) => {
            response.send(request.query.user + ' is not a ' + request.query.role + ' anymore.');
        });

    });


    app.get('/api/meals', isAuthenticated, (req, res) => {
        mealService.getAll(req.user.username, (err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.get('/api/meals/:mealId', isAuthenticated, (req, res) => {
        mealService.get(req.params.mealId, req.user.username, (err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.delete('/api/meals/:mealId', isAuthenticated, (req, res) => {
        mealService.delete(req.params.mealId, req.user.username, (err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.put('/api/meals/:mealId', isAuthenticated, (req, res) => {
        mealService.update(req.params.mealId, req.user.username, req.body, (err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.post('/api/meals', isAuthenticated, (req, res) => {
        mealService.add(req.user.username, req.body, (err, data) => {
            returnResponse(err, data, res)
        })
    });


    //admin protected routes
    app.get('/api/admin/meals', isAuthenticated, aclMiddleware, (req, res) => {
        mealAdminService.getAll((err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.get('/api/admin/meals/:mealId', isAuthenticated, aclMiddleware, (req, res) => {
        mealAdminService.get(req.params.mealId, (err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.delete('/api/admin/meals/:mealId', isAuthenticated, aclMiddleware, (req, res) => {
        mealAdminService.delete(req.params.mealId, (err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.put('/api/admin/meals/:mealId', isAuthenticated, aclMiddleware, (req, res) => {
        mealAdminService.update(req.params.mealId, req.body, (err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.post('/api/admin/meals', isAuthenticated, aclMiddleware, (req, res) => {
        mealAdminService.add(req.user.username, req.body, (err, data) => {
            returnResponse(err, data, res)
        })
    });


    app.get('/api/settings', isAuthenticated, (req, res) => {
        settingsService.getSettings(req.user.username, (err, data) => {
            returnResponse(err, data, res)
        })
    });
    app.post('/api/settings', isAuthenticated, (req, res) => {
        settingsService.saveSettings(req.user.username,
            Object.assign({}, {username: req.user.username}, req.body), (err, data) => {
                returnResponse(err, data, res)
            })
    });


    app.get('/signout', (req, res) => {
        console.log(req.isAuthenticated());
        req.logout();
        res.redirect('/login');
    });
    app.get('/login', (req, res) => {
        res.render('login.jade', {message: req.flash('error')});
    });
    app.post('/login',
        passport.authenticate('login', {
            successRedirect: '/meals',
            failureRedirect: '/login',
            failureFlash: true
        })
    );


    app.get('/signup', (req, res) => {
        res.render('signup.jade', {message: req.flash('error')});
    });
    app.post('/signup',
        passport.authenticate('signup', {
            successRedirect: '/meals',
            failureRedirect: '/signup',
            failureFlash: true
        })
    );


    app.get('*', isAuthenticatedWithRedirect, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
    });

    let server = app.listen(3000, () => {
        let host = server.address().address;
        let port = server.address().port;
    });
});


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401);
        res.send("Authentication required.")
    }
}

function isAuthenticatedWithRedirect(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect("/login");
    }
}

function returnResponse(err, data, res) {
    if (err) {
        res.status(500);
        res.send(err);
    } else {
        res.json(data);
    }
}