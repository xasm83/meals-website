import React from "react";
import {render} from "react-dom";
import {Route, Router} from 'react-router'
import {Provider} from 'react-redux'
import thunk from "redux-thunk"
import {createStore, applyMiddleware} from 'redux'
import reducers from "./reducers"
import createBrowserHistory from 'history/createBrowserHistory'


import FooterComponent from "./footer/footerComponent";
import SettingsComponent from "./settings/settingsComponent";
import MealsComponent from "./meals/mealsComponent";
import MealComponent from "./meals/mealComponent";

const browserHistory = createBrowserHistory();
let store = createStore(reducers, {}, applyMiddleware(thunk));


render(
    <Provider store={store}>

        <Router history={browserHistory}>
            <div>
                <FooterComponent/>
                <Route exact path="/admin/meals"
                       component={(props) => (<MealsComponent {...props} isAdminUrl/>)}/>
                <Route exact path="/admin/meals/add"
                       component={(props) => (<MealComponent {...props} isAdminUrl/>)}/>
                <Route exact path="/admin/meals/edit/:id"
                       component={(props) => (<MealComponent {...props} isAdminUrl/>)}/>

                <Route exact path="/meals" component={MealsComponent}/>
                <Route exact path="/meals/add" component={MealComponent}/>
                <Route exact path="/meals/edit/:id" component={MealComponent}/>
                <Route path="/settings" component={SettingsComponent}/>
            </div>
        </Router>
    </Provider>,
    document.getElementById('reduxContainer')
);