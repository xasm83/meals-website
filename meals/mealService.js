let MealDao = require('./mealDao').MealDao;
let ObjectID = require('mongodb').ObjectID;

class MealService {

    constructor(db) {
        this.mealDao = new MealDao(db);
    }

    getAll(username, callback) {
        this.mealDao.getAll({username}, callback);
    };

    get(_id, username, callback) {
        this.mealDao.get({_id: new ObjectID(_id), username}, callback);
    };

    update(_id, username, meal, callback) {
        this.mealDao.update({
            _id: new ObjectID(_id),
            username
        }, Object.assign(meal, {_id: new ObjectID(_id), username}), callback);
    }

    add(username, meal, callback) {
        this.mealDao.insert(Object.assign(meal, {_id: new ObjectID(), username}), callback);
    }

    delete(_id, username, callback) {
        this.mealDao.delete({_id: new ObjectID(_id), username}, callback);
    }
}

module.exports.MealService = MealService;