// frontend/src/pages/LoginPage.js - Secure login form

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SecurityUtils from '../utils/security';
import InputField from '../components/InputField';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, verifyOTP, resendOTP, error: authError } = useAuth();

  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otpUserId, setOtpUserId] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    const phoneValidation = SecurityUtils.validateInput(formData.phone, 'phone', true);
    if (!phoneValidation.valid) newErrors.phone = phoneValidation.error;

    const passwordValidation = SecurityUtils.validateInput(formData.password, 'text', true);
    if (!passwordValidation.valid) newErrors.password = 'Modpas nesesè.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await login(formData.phone, formData.password);
      if (response.requiresOTP) {
        setRequiresOTP(true);
        setOtpUserId(response.userId);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      setOtpError('Kòd OTP la dwe gen 6 chif.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(otpUserId, otpCode);
      navigate('/dashboard');
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await resendOTP(otpUserId);
      setOtpError('');
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (requiresOTP) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Verifye OTP</h2>
          <p className="text-gray-600 mb-6">Kòd OTP voye nan imel ou. Tanpri entè.
          <form onSubmit={handleVerifyOTP}>
            <InputField
              label="Kòd OTP (6 chif)"
              type="text"
              maxLength="6"
              value={otpCode}
              onChange={setOtpCode}
              placeholder="000000"
              required
            />
            {otpError && <p className="text-red-500 mb-4">{otpError}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Ap tretman...' : 'Verifye'}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              className="w-full mt-2 text-blue-600 hover:underline"
            >
              Renvoye OTP
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Koneksyon</h2>
        <form onSubmit={handleLogin}>
          <InputField
            label="Nimewo Telefòn"
            type="tel"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            error={errors.phone}
            placeholder="+50935555555"
            required
            validation="phone"
          />
          <InputField
            label="Modpas"
            type="password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            error={errors.password}
            placeholder="•••••••••••••"
            required
          />
          {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Ap konekte...' : 'Konekte'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Pa gen kont?
          <a href="/register" className="text-blue-600 hover:underline">
            {' '}
            Enskripsyon
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
