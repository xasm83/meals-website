let MealDao = require('./mealDao').MealDao;
let ObjectID = require('mongodb').ObjectID;

class MealsAdminService {

    constructor(db) {
        this.mealDao = new MealDao(db);
    }

    getAll(callback) {
        this.mealDao.getAll({}, callback);
    };

    get(_id, callback) {
        this.mealDao.get({_id: new ObjectID(_id)}, callback);
    };

    update(meal, callback) {
        this.mealDao.update({_id: new ObjectID(_id)},
            Object.assign(meal, {_id: new ObjectID(_id)}), callback);
    }

    add(username, meal, callback) {
        this.mealDao.insert(Object.assign(meal, {_id: new ObjectID(), username}), callback);
    }

    delete(_id, callback) {
        this.mealDao.delete({_id: new ObjectID(_id)}, callback);
    }
}

module.exports.MealsAdminService = MealsAdminService;