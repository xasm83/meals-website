import {combineReducers} from 'redux'

const hasFailed = (hasFailed = false, action) => {
    switch (action.type) {
        case 'MEALS_FAILED':
            return action.hasFailed;
        default:
            return hasFailed;
    }
};


const meals = (meals = [], action) => {
    switch (action.type) {
        case 'MEALS_FETCHED':
            return action.meals;
        default:
            return meals;
    }
};

export default combineReducers({meals, hasFailed})