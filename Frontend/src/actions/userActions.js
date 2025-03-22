import {
    CLEAR_ERRORS,
    LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS,
    LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS,
    LOGOUT_SUCCESS, LOGOUT_FAIL,
    REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS
} from "../constants/userConstants";
import axios from '../axios';

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });
        const config = { 
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            withCredentials: true
        };
        
        const { data } = await axios.post(
            `/login`,
            { email, password },
            config
        );

        dispatch({ type: LOGIN_SUCCESS, payload: data.user });
        localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: error.response?.data?.message || 'Login failed' });
        throw error;
    }
}

export const register = (email, password, name, role, speciality, availability) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });
        const config = { 
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            withCredentials: true
        }
        
        const { data } = await axios.post(
            `/register`,
            { email, password, name, role, speciality, availability },
            config
        )

        dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
        localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
        dispatch({ type: REGISTER_USER_FAIL, payload: error.response?.data?.message || 'Registration failed' });
        throw error;
    }
}

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        // First try to get user from localStorage
        const localUser = localStorage.getItem('user');
        if (localUser) {
            dispatch({ type: LOAD_USER_SUCCESS, payload: JSON.parse(localUser) });
        }

        // Then try to get fresh data from server
        const { data } = await axios.get(`/me`);
        dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
        localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
        dispatch({ type: LOAD_USER_FAIL, payload: error.response?.data?.message || 'Failed to load user' });
        localStorage.removeItem('user');
        throw error;
    }
};

export const logout = () => async (dispatch) => {
    try {
        await axios.get(`/logout`);
        dispatch({ type: LOGOUT_SUCCESS });
        localStorage.removeItem('user');
    } catch (error) {
        dispatch({ type: LOGOUT_FAIL, payload: error.response?.data?.message || 'Logout failed' });
        throw error;
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}