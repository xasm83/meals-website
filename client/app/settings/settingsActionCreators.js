import {reduxFetch, settingsUrl} from '../fetch'

export const setCalories = (calories) => {
    return {
        type: 'SET_CALORIES',
        calories: calories
    };
};

export const settingsFailed = (bool) => {
    return {
        type: 'SETTINGS_FAILED',
        hasFailed: bool
    };
};

export const settingsSaved = (bool) => {
    return {
        type: 'SETTINGS_SAVED',
        settingsSaved: bool

    };
};

export const settingsFetched = (calories) => {
    return {
        type: 'SETTINGS_FETCHED',
        calories
    };
};

export const caloriesFetchDataThunk = () => {
    return (dispatch) => {
        reduxFetch.fetchAll(settingsUrl, () => {
                dispatch(settingsFailed(true));
            }, (items) => {
                dispatch(settingsFetched(items.calories));
            }
        )
    };
};

export const saveSettings = () => {
    return (dispatch, getState) => {
        reduxFetch.post(settingsUrl, {
                calories: getState().settings.calories
            }, () => {
                dispatch(settingsFailed(true));
            }, () => {
                dispatch(settingsFailed(false));
                dispatch(settingsSaved(true));
            }
        )
    };
};



