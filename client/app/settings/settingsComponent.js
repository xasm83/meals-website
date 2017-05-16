import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormGroup, FormControl, ControlLabel, Row, Col, Grid, Alert, Button} from 'react-bootstrap';
import {caloriesFetchDataThunk, saveSettings, settingsSaved, setCalories} from './settingsActionCreators'
import {Link} from 'react-router-dom'

class SettingsComponent extends React.Component {
    componentWillMount() {
        this.props.fetchData();
    }

    render() {
        if (this.props.hasFailed) {
            return <Alert bsStyle="danger">Error handling settings</Alert>;
        }
        return (

            <div className="vertical-center">
                <Grid>
                    <Row className="show-grid">
                        <Col md={4} mdOffset={4}>
                            {
                                this.props.settingsSaved &&
                                <Alert bsStyle="info" onDismiss={this.props.dismissSettingsSaved}>Settings are
                                    saved</Alert>
                            }
                            <form>
                                <FormGroup
                                    controlId="formBasicText"
                                    validationState={this.props.validationState}
                                >
                                    <ControlLabel>Enter your daily calories</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.props.calories}
                                        placeholder="12345"
                                        onChange={this.props.handleChange}
                                    />
                                    <FormControl.Feedback />
                                </FormGroup>
                                <FormGroup>
                                    <Button bsStyle="primary" onClick={this.props.saveSettings}
                                            disabled={this.props.validationState != 'success'}>Save</Button>
                                </FormGroup>
                            </form>
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

const mapStateToProps = (state) => {
    return {
        calories: state.settings.calories,
        hasFailed: state.settings.hasFailed,
        settingsSaved: state.settings.settingsSaved,
        validationState: getValidationState(state.settings.calories)
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: () => dispatch(caloriesFetchDataThunk()),
        handleChange: (event) => dispatch(setCalories(event.target.value)),
        saveSettings: () => dispatch(saveSettings()),
        dismissSettingsSaved: () => dispatch(settingsSaved(false))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);