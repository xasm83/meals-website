import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
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
        console.log("s" + this.startDate.format() + "e" + this.endDate.format());
    }

    handleStartHourChange(time) {
        console.log("s" + this.state.startHour.format() + "t" + time.format());
        if (time >= this.state.endHour) {
            this.setState({startHour: moment(this.state.endHour).subtract(2, 'minutes')});
        } else {
            this.setState({startHour: time});
        }
        console.log("s" + this.state.startHour.format() + "t" + time.format());
    }

    handleEndHourChange(time) {
        console.log("e" + this.state.endHour.format() + "t" + time.format());
        if (time <= this.state.startHour) {
            this.setState({endHour: moment(this.state.startHour).add(2, 'minutes')});
        } else {
            this.state.endHour = time;
        }
    }


    getMealsUrl() {
        return this.props.isAdminUrl ? "/admin/meals" : "/meals";
    }

    render() {
        if (this.props.hasFailed) {
            return (
                <div className="vertical-center">
                    <Grid >
                        <Row className="show-grid">
                            <Col md={10} mdOffset={1}>
                                <form>
                                    <FormGroup>
                                        <Alert bsStyle="danger">Error handling meals</Alert>
                                    </FormGroup>
                                </form>
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
                            <form>
                                <FormGroup>
                                    <Link to={this.getMealsUrl() + '/add' }><Button
                                        bsStyle="primary">Add
                                        meal</Button></Link>
                                </FormGroup>
                            </form>
                        </Col>
                    </Row>

                    { !this.props.isAdminUrl && <Row className="show-grid">
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
                    </Row>}

                    <Row className="show-grid">
                        <Col md={10} mdOffset={1}>
                            <ListGroup>
                                {this.props.meals.map((meal) => {
                                        return (
                                            <Link key={meal._id}
                                                  to={this.getMealsUrl() + '/edit/' + meal._id}>
                                                <ListGroupItem bsStyle="success">
                                                    Text: {meal.text},
                                                    Date: {moment(meal.date).format("dddd, MMMM Do YYYY, h:mm:ss a")},
                                                    Calories: {meal.calories},
                                                    Username: {meal.username}
                                                </ListGroupItem>
                                            </Link>)
                                    }
                                )}
                            </ListGroup>
                        </Col>
                    </Row>
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