class SettingsDao {
    constructor(db) {
        this.db = db;
    }

    saveSettings(username, settings, callback) {
        let collection = this.db.collection('settings');
        collection.updateOne({username: username}, settings, {upsert: true}, callback);
    };

    getSettings(username, callback) {
        let collection = this.db.collection('settings');
        collection.findOne({username: username}, callback);
    }
}

module.exports.SettingsDao = SettingsDao;

