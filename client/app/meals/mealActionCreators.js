import {reduxFetch, mealsUrl, mealsAdminUrl} from '../fetch'

export const addMeal = (history, isAdmin) => {
    return (dispatch, getState) => {
        reduxFetch.post(getMealsUrl(isAdmin),
            getState().meal.meal
            , () => {
                dispatch(mealFailed(true));
            }, () => {
                dispatch(mealFailed(false));
                dispatch(mealSaved(true));
                history.push(getRedirectUrl(isAdmin));
            }
        )
    };
};

export const updateMeal = (history, isAdmin) => {
    return (dispatch, getState) => {
        let meal = getState().meal.meal;
        reduxFetch.put(getMealsUrl(isAdmin) + "/" + meal._id,
            meal
            , () => {
                dispatch(mealFailed(true));
            }, () => {
                dispatch(mealFailed(false));
                dispatch(mealSaved(true));
                history.push(getRedirectUrl(isAdmin));
            }
        )
    };
};

export const deleteMeal = (id, history, isAdmin) => {
    return (dispatch) => {
        reduxFetch.deleteById(getMealsUrl(isAdmin), id
            , () => {
                dispatch(mealFailed(true));
            }, () => {
                dispatch(mealFailed(false));
                history.push(getRedirectUrl(isAdmin));
            }
        )
    };
};

function getRedirectUrl(isAdmin) {
    return isAdmin ? "/admin/meals" : "/meals"
}

function getMealsUrl(isAdmin) {
    return isAdmin ? mealsAdminUrl : mealsUrl
}

export const mealFetch = (id, isAdmin) => {
    return (dispatch) => {
        reduxFetch.fetchById(getMealsUrl(isAdmin), id, () => {
                dispatch(mealFailed(true));
            }, (meal) => {
                dispatch(mealFailed(false));
                dispatch(setMeal(meal));
            }
        )
    };
};

export const setMeal = (meal) => {
    return (dispatch) => {
        dispatch(mealFailed(false));
        dispatch(setText(meal.text));
        dispatch(setCalories(meal.calories));
        dispatch(setDate(meal.date));
        dispatch(setId(meal._id));
    };
};

export const mealFailed = (bool) => {
    return {
        type: 'MEAL_FAILED',
        hasFailed: bool
    };
};

export const mealSaved = (bool) => {
    return {
        type: 'MEAL_SAVED',
        mealSaved: bool
    };
};

export const setText = (text) => {
    return {
        type: 'MEAL_TEXT_SET',
        text
    };
};

export const setCalories = (calories) => {
    return {
        type: 'MEAL_CALORIES_SET',
        calories
    };
};

export const setDate = (date) => {
    return {
        type: 'MEAL_DATE_SET',
        date
    };
};

export const setId = (_id) => {
    return {
        type: 'MEAL_ID_SET',
        _id
    };
};




