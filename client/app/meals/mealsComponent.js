import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {
    Form,
    FormGroup,
    ControlLabel,
    Label,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
    Grid,
    Button,
    Alert
} from 'react-bootstrap';
import {mealsFetch, setMealIdToEdit} from './mealsActionCreators'
import moment from 'moment'
import ReactDatetime from 'react-datetime'

import {Calendar, DateRange} from 'react-date-range';

class MealsComponent extends React.Component {
    componentWillMount() {
        this.props.fetchMeals();
        this.state = {startHour: moment().startOf("day"), endHour: moment()};
    }

    constructor(props) {
        super(props);
    }

    handleSelect(range) {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
    }

    handleStartHourChange(time) {
        if (time >= this.state.endHour) {
            this.setState({startHour: moment(this.state.endHour).subtract(2, 'minutes')});
        } else {
            this.setState({startHour: time});
        }
    }

    handleEndHourChange(time) {
        if (time <= this.state.startHour) {
            this.setState({endHour: moment(this.state.startHour).add(2, 'minutes')});
        } else {
            this.state.endHour = time;
        }
    }

    filterMeals(meals) {
        return meals.filter(meal => {
            let date = moment(meal.date);
            return this.props.isAdminUrl || date.isAfter(moment(this.startDate).startOf('day')) &&
                date.isBefore(this.endDate) &&
                this.getMinutes(date) > this.getMinutes(this.state.startHour) &&
                this.getMinutes(date) < this.getMinutes(this.state.endHour) + 1;//+1 is to consider seconds

        })
    }

    reduceMealsToDays(meals) {
        return meals.reduce((days, meal) => {
            let dayKey = moment(meal.date).startOf("day").valueOf();
            let day = days.get(dayKey);
            if (day) {
                day.calories += meal.calories;
                day.meals.push(meal);
            } else {
                day = {};
                day.meals = [meal];
                day.calories = meal.calories;
                day.date = moment(meal.date).startOf("day");
            }
            days.set(dayKey, day);
            return days;
        }, new Map());
    }

    getMinutes(date) {
        return (date.minutes() + date.hours() * 60);
    }

    getMealsUrl() {
        return this.props.isAdminUrl ? "/admin/meals" : "/meals";
    }

    renderDays(meals) {
        let daysIterable = this.reduceMealsToDays(this.filterMeals(meals)).values();
        return ( [...daysIterable].map(day => {
                return (
                    <div key={day.date.unix()}>
                        <FormGroup>
                            <Label bsStyle="info">Date: {day.date.format('YYYY/MM/DD')}</Label>&nbsp;
                            <Label
                                bsStyle={day.calories > this.props.maxCalories ? "danger" : "success"}>Calories: {day.calories}
                            </Label>
                        </FormGroup>
                        <ListGroup>
                            {day.meals.map(this.renderMeal.bind(this))}
                        </ListGroup>
                    </div>
                )
            })
        )
    }

    renderMeal(meal) {
        return (
            <Link key={meal._id}
                  to={this.getMealsUrl() + '/edit/' + meal._id}>
                <ListGroupItem bsStyle="success">
                    Text: {meal.text},
                    Date: {moment(meal.date).format("dddd, MMMM Do YYYY, h:mm:ss")},
                    Calories: {meal.calories},
                    Username: {meal.username}
                </ListGroupItem>
            </Link>)
    }

    render() {
        if (this.props.hasFailed) {
            return (
                <div className="vertical-center">
                    <Grid >
                        <Row className="show-grid">
                            <Col md={10} mdOffset={1}>
                                <Form>
                                    <FormGroup>
                                        <Alert bsStyle="danger">Error handling meals</Alert>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>
                    </Grid>
                </div>);
        }

        return (
            <div className="vertical-center">
                <Grid>
                    <Row className="show-grid">
                        <Col md={10} mdOffset={1}>
                            <Form>
                                <FormGroup>
                                    <Link to={this.getMealsUrl() + '/add' }><Button
                                        bsStyle="primary">Add
                                        meal</Button></Link>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>


                    {
                        !this.props.isAdminUrl && <Row className="show-grid">
                            <Col md={10} mdOffset={1}>
                                <Form horizontal>
                                    <FormGroup controlId="formHorizontalEmail">
                                        <Col sm={2}>
                                            <ControlLabel>Date range</ControlLabel>
                                        </Col>
                                        <Col sm={8}>
                                            <DateRange
                                                calendars={1}
                                                onInit={(range) => this.handleSelect(range)}
                                                onChange={(range) => this.handleSelect(range)}
                                            />
                                        </Col>
                                    </FormGroup>

                                    <FormGroup controlId="formHorizontalEmail">
                                        <Col sm={2}>
                                            <ControlLabel>Start time</ControlLabel>
                                        </Col>
                                        <Col sm={3}>
                                            <ReactDatetime value={ this.state.startHour} input={false}
                                                           dateFormat={false}
                                                           onChange={(date) => this.handleStartHourChange(date)}/>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup controlId="formHorizontalEmail">
                                        <Col sm={2}>
                                            <ControlLabel>End time</ControlLabel>
                                        </Col>
                                        <Col sm={3}>
                                            <ReactDatetime value={ this.state.endHour} input={false} dateFormat={false}
                                                           onChange={(date) => this.handleEndHourChange(date)}/>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>
                    }

                    {
                        !this.props.isAdminUrl ?
                            <Row className="show-grid">
                                <Col md={10} mdOffset={1}>
                                    {this.renderDays(this.props.meals)}
                                </Col>
                            </Row>
                            :
                            <Row className="show-grid">
                                <Col md={10} mdOffset={1}>
                                    <ListGroup>
                                        {this.filterMeals(this.props.meals).map(this.renderMeal.bind(this))}
                                    </ListGroup>
                                </Col>
                            </Row>
                    }
                </Grid>
            </div>
        )
    }
}

function getValidationState(calories) {
    return (/^(\-|\+)?([0-9]+)$/.test(calories)) ? 'success' : 'error';
}

const mapStateToProps = (state, ownProps) => {
    return {
        maxCalories: state.settings.calories,
        isAdminUrl: ownProps.isAdminUrl,
        meals: state.meals.meals,
        hasFailed: state.meals.hasFailed,
        validationState: getValidationState(state.settings.calories)
    };
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchMeals: () => {
            dispatch(mealsFetch(ownProps.isAdminUrl))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MealsComponent);