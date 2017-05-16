import {combineReducers} from 'redux'
import settings from './settings/settingsReducers'
import meals from './meals/mealsReducers'
import meal from './meals/mealReducers'
import {isAdmin} from './footer/footerReducers'

export default combineReducers({settings, meals, meal, isAdmin});


