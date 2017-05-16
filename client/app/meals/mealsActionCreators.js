import {reduxFetch, mealsUrl, mealsAdminUrl} from '../fetch'


export const mealsFailed = (bool) => {
    return {
        type: 'MEALS_FAILED',
        hasFailed: bool
    };
};

export const mealsFetched = (meals) => {
    return {
        type: 'MEALS_FETCHED',
        meals
    };
};

export const mealsFetch = (isAdmin) => {
    return (dispatch) => {
        reduxFetch.fetchAll(isAdmin ? mealsAdminUrl : mealsUrl, () => {
                dispatch(mealsFailed(true));
            }, (items) => {
                dispatch(mealsFailed(false));
                dispatch(mealsFetched(items));
            }
        )
    };
};




