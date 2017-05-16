let SettingsDao = require('./settingsDao').SettingsDao;

class SettingsService {

    constructor(db) {
        this.settingsDao = new SettingsDao(db);
    }

    getSettings(username, callback) {
        this.settingsDao.getSettings(username, callback);
    };

    saveSettings(username, settings, callback) {
        this.settingsDao.saveSettings(username, settings, callback);
    }
}

module.exports.SettingsService = SettingsService;