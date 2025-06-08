import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Fungsi validasi email yang lebih ketat
  const validateEmail = (email) => {
    if (!email) return { valid: false, message: '' };

    // Karakter yang tidak diperbolehkan
    const forbiddenChars = /[#!*&%$?\/><|{}()\[\]=+\-`~^]/;

    // Regex untuk format email yang valid (hanya huruf, angka, underscore, titik, dan @)
    const validEmailPattern = /^[a-zA-Z0-9._@]+$/;

    // Regex untuk format email standar yang lebih ketat
    const emailFormatPattern = /^[a-zA-Z0-9][a-zA-Z0-9._]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

    // Cek domain yang tidak boleh dimulai atau diakhiri dengan titik atau dash
    const domainPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

    if (forbiddenChars.test(email)) {
      return {
        valid: false,
        message: 'Email tidak boleh mengandung karakter khusus seperti #!*&%$?/><|{}()[]=-+`~^'
      };
    }

    if (!validEmailPattern.test(email)) {
      return {
        valid: false,
        message: 'Email hanya boleh mengandung huruf, angka, underscore (_), titik (.), dan simbol @'
      };
    }

    if (email.includes('..') || email.includes('._') || email.includes('_.')) {
      return {
        valid: false,
        message: 'Email tidak boleh memiliki titik atau underscore berturut-turut'
      };
    }

    if (email.startsWith('.') || email.startsWith('_') || email.includes('@.') || email.includes('.@')) {
      return {
        valid: false,
        message: 'Format email tidak valid'
      };
    }

    if (!domainPattern.test(email)) {
      return {
        valid: false,
        message: 'Format email tidak valid. Contoh: user@example.com'
      };
    }

    // Validasi panjang email
    if (email.length < 5 || email.length > 254) {
      return {
        valid: false,
        message: 'Email harus antara 5-254 karakter'
      };
    }

    return { valid: true, message: '' };
  };

  // Fungsi validasi kekuatan password
  const checkPasswordStrength = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const score = Object.values(criteria).filter(Boolean).length;

    return { criteria, score };
  };

  // Fungsi untuk mendapatkan warna berdasarkan kekuatan password
  const getPasswordStrengthColor = (score) => {
    if (score === 0) return 'bg-gray-200';
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Fungsi untuk mendapatkan text kekuatan password
  const getPasswordStrengthText = (score) => {
    if (score === 0) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Validasi email secara real-time
    if (name === 'email') {
      const emailValidation = validateEmail(value);
      setEmailError(emailValidation.message);
      setEmailValid(emailValidation.valid);
    }

    // Validasi password secara real-time
    if (name === 'password') {
      const { criteria, score } = checkPasswordStrength(value);
      setPasswordCriteria(criteria);
      setPasswordStrength(score);

      // Reset password match jika password berubah
      if (formData.password_confirmation) {
        setPasswordMatch(value === formData.password_confirmation);
      }
    }

    // Validasi password confirmation secara real-time
    if (name === 'password_confirmation') {
      setPasswordMatch(formData.password === value);
    }
  };

  // Effect untuk memvalidasi password match ketika password berubah
  useEffect(() => {
    if (formData.password && formData.password_confirmation) {
      setPasswordMatch(formData.password === formData.password_confirmation);
    }
  }, [formData.password, formData.password_confirmation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi email sebelum submit
    if (!emailValid) {
      setError('Please fix the email format before submitting');
      setLoading(false);
      return;
    }

    // Validasi password strength
    if (passwordStrength < 3) {
      setError('Password must be at least Fair strength (minimum 3 criteria)');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join CinemaApp with secure credentials</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${emailError
                      ? 'border-red-300 focus:ring-red-500'
                      : emailValid && formData.email
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  placeholder="Enter your email"
                />
                {/* Email Status Icon */}
                {formData.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {emailValid ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {/* Email Error Message */}
              {emailError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  {emailError}
                </p>
              )}
              {/* Email Success Message */}
              {emailValid && formData.email && !emailError && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Email format is valid
                </p>
              )}
              {/* Email Helper Text */}
              <p className="mt-1 text-xs text-gray-500">
                Email hanya boleh mengandung huruf, angka, underscore (_), titik (.), dan @ symbol
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {/* Password Strength Bar */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-600' :
                        passwordStrength <= 3 ? 'text-yellow-600' :
                          passwordStrength <= 4 ? 'text-blue-600' : 'text-green-600'
                      }`}>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Criteria */}
              {formData.password && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-600 mb-2">Password must contain:</p>
                  {[
                    { key: 'length', text: 'At least 8 characters' },
                    { key: 'uppercase', text: 'One uppercase letter (A-Z)' },
                    { key: 'lowercase', text: 'One lowercase letter (a-z)' },
                    { key: 'number', text: 'One number (0-9)' },
                    { key: 'special', text: 'One special character (!@#$%^&*)' }
                  ].map(({ key, text }) => (
                    <div key={key} className="flex items-center text-xs">
                      {passwordCriteria[key] ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className={passwordCriteria[key] ? 'text-green-600' : 'text-gray-500'}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${passwordMatch === false ? 'border-red-300 focus:ring-red-500' :
                      passwordMatch === true ? 'border-green-300 focus:ring-green-500' :
                        'border-gray-300 focus:ring-green-500'
                    }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
                {/* Password Match Status Icon */}
                {formData.password_confirmation && (
                  <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
                    {passwordMatch === true ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : passwordMatch === false ? (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {/* Password Match Feedback */}
              {formData.password_confirmation && (
                <p className={`mt-1 text-sm flex items-center ${passwordMatch === true ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {passwordMatch === true ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !emailValid || passwordStrength < 3 || passwordMatch !== true}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${(loading || !emailValid || passwordStrength < 3 || passwordMatch !== true)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Secure Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;