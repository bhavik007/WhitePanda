import config from '../../config.json';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    loginWithOtp,
    verifyOtp
};

function verifyOtp(mobile, otp) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ mobile: mobile, otp: otp })
    };

    return fetch(`${config.apiUrl}/user/verify-otp`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function loginWithOtp(mobile) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ mobile: mobile })
    };

    return fetch(`${config.apiUrl}/user/user-signin-with-otp`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ user_name: username, password })
    };

    return fetch(`${config.apiUrl}/user/user-signin`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout(user) {
    // let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const requestOptions = {
            method: 'PUT',
            headers: authHeader(),
            body: JSON.stringify({ access_token: user.access_token })
        };

        return fetch(`${config.apiUrl}/user/user-signout`, requestOptions)
            .then(handleResponse)
            .then(user => {
                localStorage.removeItem('user');
                return user;
            });
    } else {
        return user;
    }
    
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/user/user-signup`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!data.status) {
            const error = data && data.error && data.error.message;
            return Promise.reject(error);
        }
        return data.data;
    });
}