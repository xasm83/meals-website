let LoginDao = require('./loginDao').LoginDao;
let bcrypt = require('bcrypt');

class LoginService {
    constructor(db) {
        this.loginDao = new LoginDao(db);
    }

    authenticate(username, password, done) {
        this.loginDao.getUser(username, (err, user) => {
            if (err || user == null) {
                return done(null, false, {message: "Can't find user to authenticate: " + username});
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Incorrect password for username:  " + username});
                }
            }
        });
    };

    createUser(username, password, done) {
        this.loginDao.getUser(username, (err, user) => {
            if (!err && !user) {
                this.serializeUser(username, bcrypt.hashSync(password, 10), done);
            } else if (!err) {
                return done(null, false, {message: "User already exists."});
            } else {
                console.log("Server error. Unable to lookup user before create. Error: " + err);
                return done(null, false, {message: "Server error. Unable to lookup user before create. User name:" + username});
            }
        });
    }

    serializeUser(username, password, done) {
        this.loginDao.upsertUser(username, password, (err, result) => {
            if (err) {
                console.log("Server error. Unable to create user. Error: " + err);
                return done(null, false, {message: "Server error. Unable to create user."});
            } else {
                return done(null, {username: username, password: password});
            }
        });

    }

    serialize(user, done) {
        console.log("in login service serialize, user is" + user);
        this.serializeUser(user.username, user.password, (err, user, message) => {
            done(err, user && user.username || false, message || null);
        });
    };

    deserialize(username, done) {
        console.log("in login service deserialize, username is " + username);
        this.loginDao.getUser(username, (err, user) => {
            if (err || user == null) {
                return done(null, false, {message: "Can't find user to deserialize: " + username});
            } else {
                return done(null, user);
            }
        });
    };
}

module.exports.LoginService = LoginService;