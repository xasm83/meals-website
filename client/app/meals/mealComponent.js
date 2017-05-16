import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Row,
    Col,
    Grid,
    Button,
    Alert
} from 'react-bootstrap';
import {addMeal, updateMeal, setCalories, setText, setDate, setMeal, deleteMeal, mealFetch} from './mealActionCreators'
import ReactDatetime from 'react-datetime'
import {Link} from 'react-router-dom'

class MealComponent extends React.Component {
    componentWillMount() {
        if (this.props.match.params.id) {
            this.props.fetchMeal(this.props.match.params.id);
        } else {
            this.props.setMealToEdit({_id: -1, text: "", date: new Date(), calories: 0});
        }
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div className="vertical-center">
                <Grid>
                    <Row className="show-grid">
                        <Col md={10} mdOffset={1}>

                            {this.props.hasFailed &&
                            <Alert bsStyle="danger">Error handling meal</Alert>}

                            <form>
                                <FormGroup controlId="calories" validationState={this.props.validationState}>
                                    <ControlLabel>Calories</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.props.meal.calories}
                                        placeholder="12345"
                                        onChange={this.props.handleCaloriesChange}/>
                                    <FormControl.Feedback />
                                </FormGroup>

                                <FormGroup controlId="text">
                                    <ControlLabel>Text</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.props.meal.text}
                                        placeholder="Text example"
                                        onChange={this.props.handleTextChange}/>
                                </FormGroup>


                                <FormGroup controlId="text">
                                    <ControlLabel>Date</ControlLabel>
                                    <ReactDatetime value={this.props.meal.date} onChange={this.props.handleDateChange}/>

                                </FormGroup>

                                <FormGroup>
                                    <Button bsStyle="primary"
                                            onClick={this.props.match.params.id ? () => this.props.updateMeal(this.props.history) :
                                                () => this.props.addMeal(this.props.history)}
                                            disabled={this.props.validationState != 'success'}>Save</Button>
                                </FormGroup>

                                {this.props.match.params.id &&
                                <FormGroup>
                                    <Button bsStyle="danger"
                                            onClick={ () => this.props.deleteMeal(this.props.match.params.id, this.props.history)}>Delete</Button>
                                </FormGroup>
                                }


                                <FormGroup>
                                    <Link to={'/meals'}><Button bsStyle="primary">Cancel</Button></Link>
                                </FormGroup>
                            </form>
                        </Col>
                    </Row>
                </Grid>
            </div >
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
        meal: state.meal.meal,
        hasFailed: state.meal.hasFailed,
        validationState: getValidationState(state.meal.meal.calories),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addMeal: (history) => dispatch(addMeal(history, ownProps.isAdminUrl)),
        updateMeal: (history) => dispatch(updateMeal(history, ownProps.isAdminUrl)),
        deleteMeal: (id, history) => dispatch(deleteMeal(id, history, ownProps.isAdminUrl)),
        handleCaloriesChange: (event) => dispatch(setCalories(event.target.value)),
        handleTextChange: (event) => {
            dispatch(setText(event.target.value))
        },
        handleDateChange: (moment) => dispatch(setDate(moment)),
        setMealToEdit: (meal) => dispatch(setMeal(meal)),
        fetchMeal: (id) => {
            dispatch(mealFetch(id, ownProps.isAdminUrl))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MealComponent);