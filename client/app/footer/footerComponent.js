import {Row, Col, Grid} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {reduxFetch, rolesUrl} from '../fetch'
import {setAdmin} from './footerActionCreators'
import {connect} from 'react-redux'
import React, {PropTypes} from 'react'

class FooterComponent extends React.Component {
    componentWillMount() {
        reduxFetch.fetchAll(rolesUrl, () => {
        }, (result) => {
            this.props.setAdmin(result.isAdmin)
        })
    }

    render() {

        return (
            <Grid>
                <Row className="show-grid">
                    <Col sm={2}>
                        <div>
                            <Link to={`/settings`}>Settings</Link>
                        </div>
                    </Col>
                    <Col sm={2}>
                        <div>
                            <Link to={`/meals`}>List of meals</Link>
                        </div>
                    </Col>

                    { this.props.isAdmin && <Col sm={2}>
                        <div>
                            <a href={`/admin/meals`}>Meals admin</a>
                        </div>
                    </Col>
                    }

                    <Col sm={2}>
                        <div>
                            <a href={`/signout`}>Signout</a>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAdmin: state.isAdmin,
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        setAdmin: (isAdmin) => {
            dispatch(setAdmin(isAdmin))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterComponent);