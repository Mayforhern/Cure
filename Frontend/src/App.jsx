import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Appointment from "./components/Appointment/Appointment";
import MyAppointment from "./components/Appointment/MyAppointment";
import LoginSignup from "./components/User/LoginSignup";
import FinalEmergency from "./pages/FinalEmergency";
import Profile from "./components/User/Profile.jsx";
import VideoCall from "./components/VideoCall.jsx";
import ChatBotButton from "./components/ChatBotButton.jsx";
import { loadUser } from './actions/userActions.js';
import { useSelector } from 'react-redux';
import { persistReduxStore } from './store.js'
import AnalysisBot from "./pages/AnalysisBot.jsx";
import AnalysisBotECG from "./pages/AnalysisBotECG.jsx";
import AnalysisBotXRAY from "./pages/AnalysisBotXRAY.jsx";
import HealthTips from "./components/HealthTips.jsx"
import Consult from './pages/Consult';

function App() {
  const { user, isAuthenticated, isAdmin } = useSelector((state) => state.user)

  useEffect(() => {
    persistReduxStore.dispatch(loadUser());
  }, []);

  return (
    <div className="flex items-center flex-col">
      <Navbar />
      <div className="pt-28 w-full">
        <Routes>
          <Route path='/' element={<Layout />}></Route>
          <Route path='/analysis' element={<AnalysisBot />}></Route>
          <Route path='/analysis/ecg' element={<AnalysisBotECG />}></Route>
          <Route path='/analysis/xray' element={<AnalysisBotXRAY />}></Route>
          <Route path='/emergency' element={<FinalEmergency />}></Route>
          <Route path='/health' element={<HealthTips/>}></Route>
          <Route path='/telemedicine' element={<VideoCall />}></Route>
          <Route path='/appointment' element={<Appointment />}></Route>
          <Route exact path='/login' element={<LoginSignup />} />
          <Route exact path='/account' element={<Profile user={user} />} />
          <Route exact path='/myappointments' element={<MyAppointment />} />
          <Route path="/consult" element={<Consult />} />
        </Routes>
        <ChatBotButton/>
      </div>
    </div>
  );
}

export default App;