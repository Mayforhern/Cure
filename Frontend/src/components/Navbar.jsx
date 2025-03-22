import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stethoscope } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../actions/userActions';

import React from 'react'

export default function Navbar() {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector(state => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const logoutUser = async (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <div className="fixed top-0 z-50 w-full bg-gradient-to-r from-blue-800 to-indigo-900 shadow-xl">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-10 w-10 text-white" />
            <span className="text-white font-semibold text-xl hidden sm:block">CureConnect</span>
          </a>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-white hover:text-gray-300">{t('navbar.dashboard')}</a>
          <a href="/telemedicine" className="text-white hover:text-gray-300">{t('navbar.telemedicine')}</a>
          <a href="/analysis" className="text-white hover:text-gray-300">{t('navbar.analysis')}</a>
          <a href="/health" className="text-white hover:text-gray-300">{t('navbar.health_tips')}</a>
          <a href="/consult" className="text-white hover:text-gray-300">{t('navbar.consult')}</a>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <select
            onChange={changeLanguage}
            value={i18n.language}
            className="p-2 bg-blue-700 text-white rounded-lg text-sm border border-blue-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
          {!isAuthenticated ? (
            <a href="/login" className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200">
              Login
            </a>
          ) : (
            <button onClick={logoutUser} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200">
              Logout
            </button>
          )}
          <a href="/account" className="relative group">
            <img className="w-10 h-10 rounded-full ring-2 ring-white/50 transition-all duration-200 group-hover:ring-blue-400" 
                 src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
                 alt="Profile" />
          </a>
        </div>
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✖' : '☰'}
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white space-y-2 p-4">
          <a href="/" className="block py-2">{t('navbar.dashboard')}</a>
          <a href="#" className="block py-2">{t('navbar.telemedicine')}</a>
          <a href="#" className="block py-2">{t('navbar.analysis')}</a>
          <a href="#" className="block py-2">{t('navbar.health_tips')}</a>
          <a href="/consult" className="block py-2">{t('navbar.consult')}</a>
          <div className="flex justify-between items-center py-2">
            <select
              onChange={changeLanguage}
              value={i18n.language}
              className="p-2 bg-gray-700 text-white rounded-md text-xs"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
            {!isAuthenticated ? (
              <a href="/login" className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium">Login</a>
            ) : (
              <button onClick={logoutUser} className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium">Logout</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
