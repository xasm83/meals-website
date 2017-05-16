import {combineReducers} from 'redux'

const hasFailed = (hasFailed = false, action) => {
    switch (action.type) {
        case 'SETTINGS_FAILED':
            return action.hasFailed;
        default:
            return hasFailed;
    }
};

const settingsSaved = (settingsSaved = false, action) => {
    switch (action.type) {
        case 'SETTINGS_SAVED':
            return action.settingsSaved;
        default:
            return settingsSaved;
    }
};

const calories = (calories = 0, action) => {
    switch (action.type) {
        case 'SETTINGS_FETCHED':
            return action.calories;
        case 'SET_CALORIES':
            return action.calories;
        default:
            return calories;
    }
};

export default combineReducers({calories, hasFailed, settingsSaved})