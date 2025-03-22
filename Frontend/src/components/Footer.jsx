import React from 'react';
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-white mt-16 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CureConnect Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-blue-500" />
                  <h3 className="text-2xl font-bold">CureConnect</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Empowering healthcare accessibility through innovative technology solutions. Your health, our priority.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
                  <li><a href="/telemedicine" className="text-gray-400 hover:text-white transition-colors duration-200">Telemedicine</a></li>
                  <li><a href="/analysis" className="text-gray-400 hover:text-white transition-colors duration-200">Analysis</a></li>
                  <li><a href="/health" className="text-gray-400 hover:text-white transition-colors duration-200">Health Tips</a></li>
                  <li><a href="/consult" className="text-gray-400 hover:text-white transition-colors duration-200">Consult Doctor</a></li>
                  <li><a href="/appointments" className="text-gray-400 hover:text-white transition-colors duration-200">Appointments</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>contact@cureconnect.com</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Healthcare Street, Medical City</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Rural TeleMed Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Rural TeleMed</h3>
                <p className="text-gray-400 leading-relaxed">
                  Quality healthcare for rural communities.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
                  <li><a href="/services" className="text-gray-400 hover:text-white transition-colors duration-200">Services</a></li>
                  <li><a href="/doctors" className="text-gray-400 hover:text-white transition-colors duration-200">Doctors</a></li>
                  <li><a href="/book" className="text-gray-400 hover:text-white transition-colors duration-200">Book Now</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>1-800-123-4567</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>contact@ruraltelemed.com</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>123 Rural Health Way, ST 12345</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                <span>&copy; 2025 CureConnect & Rural TeleMed. All rights reserved.</span>
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a href="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</a>
                <a href="/faq" className="hover:text-white transition-colors duration-200">FAQ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;