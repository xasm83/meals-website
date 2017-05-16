class MealDao {
    constructor(db) {
        this.db = db;
    }

    get(filter, callback) {
        let collection = this.db.collection('meals');
        collection.findOne(filter, callback);
    };

    getAll(filter, callback) {
        let collection = this.db.collection('meals');
        collection.find(filter).toArray(function (err, doc) {
            callback(err, doc);
        });
    };

    insert(meal, callback) {
        let collection = this.db.collection('meals');
        collection.insertOne(meal, callback);
    }

    update(filter, meal, callback) {
        let collection = this.db.collection('meals');
        collection.updateOne(filter, meal, callback);
    }

    delete(filter, meal, callback) {
        let collection = this.db.collection('meals');
        collection.deleteOne(filter, meal, callback);
    }
}

module.exports.MealDao = MealDao;

