import {combineReducers} from 'redux'

const hasFailed = (hasFailed = false, action) => {
    switch (action.type) {
        case 'MEAL_FAILED':
            return action.hasFailed;
        default:
            return hasFailed;
    }
};

const mealSaved = (mealSaved = false, action) => {
    switch (action.type) {
        case 'MEAL_SAVED':
            return action.mealSaved;
        default:
            return mealSaved;
    }
};

const mealTextSet = (text = "", action) => {
    switch (action.type) {
        case 'MEAL_TEXT_SET':
            return action.text;
        default:
            return text;
    }
};

const mealCaloriesSet = (calories = 0, action) => {
    switch (action.type) {
        case 'MEAL_CALORIES_SET':
            return action.calories;
        default:
            return calories;
    }
};

const mealDateSet = (date = new Date(), action) => {
    switch (action.type) {
        case 'MEAL_DATE_SET':
            return action.date;
        default:
            return date;
    }
};

const mealIdSet = (_id = -1, action) => {
    switch (action.type) {
        case 'MEAL_ID_SET':
            return action._id;
        default:
            return _id;
    }
};

export default combineReducers({
    meal: combineReducers({
        date: mealDateSet,
        calories: mealCaloriesSet,
        text: mealTextSet,
        _id: mealIdSet
    }),
    hasFailed,
    mealSaved
})