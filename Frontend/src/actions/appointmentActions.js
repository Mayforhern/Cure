import { MY_APPOINTMENTS_REQUEST, MY_APPOINTMENTS_SUCCESS, MY_APPOINTMENTS_FAIL, CREATE_APPOINTMENT_REQUEST, CREATE_APPOINTMENT_SUCCESS, CREATE_APPOINTMENT_FAIL, ALL_DOCTORS_REQUEST, ALL_DOCTORS_SUCCESS, ALL_DOCTORS_FAIL, CLEAR_ERRORS } from "../constants/appointmentConstants";
import axios from '../axios';

export const createAppointment = (doctorId, day, time, description) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_APPOINTMENT_REQUEST });
        
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true // Add this line
        };
        console.log(doctorId, day, time, description)

        const { data } = await axios.post(
            '/appointment/new',
            { 
                doctor: doctorId,
                description,
                day,
                time 
            },
            config
        );

        dispatch({ type: CREATE_APPOINTMENT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CREATE_APPOINTMENT_FAIL,
            payload: error.response?.data?.message || "Appointment creation failed"
        });
    }
};

export const myAppointments = () => async (dispatch) => {
    try {
        dispatch({ type: MY_APPOINTMENTS_REQUEST });
        const { data } = await axios.get('/appointment/my')

        dispatch({ type: MY_APPOINTMENTS_SUCCESS, payload: data.appointments })
    } catch (error) {
        dispatch({
            type: MY_APPOINTMENTS_FAIL,
            payload: error.response.data.message
        })
    }
}

// export const allAppointments = () => async (dispatch) => {
//     try {
//         dispatch({ type: ALL_ORDERS_REQUEST });
//         const { data } = await axios.get('/')

//         dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders })
//     } catch (error) {
//         dispatch({
//             type: ALL_ORDERS_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }

export const allDoctors = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_DOCTORS_REQUEST });
        const { data } = await axios.get('/doctors')

        dispatch({ type: ALL_DOCTORS_SUCCESS, payload: data.doctors })
    } catch (error) {
        dispatch({
            type: ALL_DOCTORS_FAIL,
            payload: error.response.data.message
        })
    }
}

// export const getOrderDetails = (id) => async (dispatch) => {
//     try {
//         dispatch({ type: ORDER_DETAILS_REQUEST });
//         const { data } = await axios.get(`/api/v1/order/${id}`);

//         dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
//     } catch (error) {
//         dispatch({
//             type: ORDER_DETAILS_FAIL,
//             payload: error.response.data.message,
//         });
//     }
// };

// For clearing errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}