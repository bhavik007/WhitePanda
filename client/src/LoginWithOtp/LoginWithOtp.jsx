import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

class LoginWithOtp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                mobile: '',
                otp: '',
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.verifyOtpSubmit = this.verifyOtpSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { user } = this.state;
        if (user.mobile) {
            this.props.loginWithOtp(user.mobile);
        }
    }

    verifyOtpSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { user } = this.state;
        if (user.mobile && user.otp) {
            this.props.verifyOtp(user.mobile, user.otp);
        }
    }

    render() {
        const { loggingIn } = this.props;
        const { user, submitted } = this.state;
        return (
            <div>
                {!submitted && <div className="col-md-6 col-md-offset-3">
                    <h2>Login With OTP</h2>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !mobile ? ' has-error' : '')}>
                            <label htmlFor="mobile">Mobile</label>
                            <input type="text" className="form-control" name="mobile" value={user.mobile} onChange={this.handleChange} />
                            {submitted && !mobile &&
                                <div className="help-block">Mobile is required</div>
                            }
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Send OTP</button>
                            {loggingIn &&
                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                            <Link to="/register" className="btn btn-link">Register</Link>
                        </div>
                    </form>
                </div>}
                {submitted && user.mobile &&
                    <div>
                        <h2>Login With OTP</h2>
                        <form name="form" onSubmit={this.verifyOtpSubmit}>
                            <div className={'form-group' + (submitted && !user.mobile ? ' has-error' : '')}>
                                <label htmlFor="mobile">Mobile</label>
                                <input type="text" className="form-control" name="mobile" value={user.mobile} onChange={this.handleChange} readOnly />
                            </div>
                            <div className={'form-group' + (submitted && !user.otp ? ' has-error' : '')}>
                                <label htmlFor="otp">OTP</label>
                                <input type="text" className="form-control" name="otp" value={user.otp} onChange={this.handleChange} />
                                {submitted && !user.otp &&
                                    <div className="help-block">OTP is required</div>
                                }
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary">Send OTP</button>
                                {loggingIn &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                                <Link to="/register" className="btn btn-link">Register</Link>
                            </div>
                        </form>
                    </div>
                }

            </div>
        );
    }
}

function mapState(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
}

const actionCreators = {
    loginWithOtp: userActions.loginWithOtp,
    verifyOtp: userActions.verifyOtp,
    logout: userActions.logout
};

const connectedLoginWithOtp = connect(mapState, actionCreators)(LoginWithOtp);
export { connectedLoginWithOtp as LoginWithOtp };