class LoginDao {
    constructor(db) {
        this.db = db;
    }

    upsertUser(username, password, callback) {
        let collection = this.db.collection('users');
        collection.updateOne({username: username}, {username: username, password: password}, {upsert: true}, callback);
    };

    getUser(username, callback) {
        let collection = this.db.collection('users');
        collection.findOne({username: username}, callback);
    }
}
module.exports.LoginDao = LoginDao;

