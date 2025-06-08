import React from 'react';
import { Link } from 'react-router-dom';
import { FilmIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <FilmIcon className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">CinemaApp</span>
            </Link>
            <p className="mt-2 text-gray-400 text-sm max-w-md">
              Your one-stop destination for booking the latest and greatest movies. 
              Experience entertainment like never before.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/bookings" className="text-gray-400 hover:text-white transition">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-gray-400 hover:text-white transition">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  <span className="block">Email: info@cinemaapp.com</span>
                </li>
                <li className="text-gray-400">
                  <span className="block">Phone: +1 234 567 890</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} CinemaApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;