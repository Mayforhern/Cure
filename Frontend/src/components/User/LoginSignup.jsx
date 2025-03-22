import { Mail, Lock, User, Stethoscope, Calendar } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { login, register, clearErrors } from '../../actions/userActions';
// import { useAlert } from 'react-alert'


const LoginSignup = () => {
    const dispatch = useDispatch();
    const { error, loading, isAuthenticated } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation();

    const [authMode, setAuthMode] = useState('login');
    const [role, setRole] = useState('patient');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        speciality: 'general',
        availability: "false"
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (authMode === "login") {
            dispatch(login(formData.email, formData.password));
        } else {
            dispatch(register(
                formData.email,
                formData.password,
                formData.name,
                role,
                formData.speciality,
                formData.availability
            ));
        }
    };

    // Add useEffect for handling authentication state
    useEffect(() => {
        if (error) {
            // You can use a toast notification here
            console.error(error);
            dispatch(clearErrors());
        }

        if (isAuthenticated) {
            navigate('/account');
        }
    }, [dispatch, error, isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-gray-600">
                            {authMode === 'login'
                                ? 'Sign in to access your account'
                                : 'Join us to start your journey'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {authMode === 'signup' && (
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        {authMode === 'signup' && (
                            <>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="patient"
                                            checked={role === 'patient'}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="form-radio text-blue-500"
                                        />
                                        <span>Patient</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="doctor"
                                            checked={role === 'doctor'}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="form-radio text-blue-500"
                                        />
                                        <span>Doctor</span>
                                    </label>
                                </div>

                                {role === 'doctor' && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                name="speciality"
                                                placeholder="Speciality"
                                                value={formData.speciality}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                required
                                            />
                                        </div>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="availability"
                                                checked={formData.availability}
                                                onChange={handleInputChange}
                                                className="form-checkbox text-blue-500 rounded"
                                            />
                                            <span>Available for Appointments</span>
                                        </label>
                                    </div>
                                )}
                            </>
                        )}

                        <input
                            value={(authMode === 'login' ? 'Sign In' : 'Create Account')}
                            type="submit"
                            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600'} text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        ></input>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginSignup