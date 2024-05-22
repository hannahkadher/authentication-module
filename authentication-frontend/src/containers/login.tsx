import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/login/LoginForm';
import { SubmitHandler } from 'react-hook-form';
import { LoginData, LoginResponse } from '../types';
import { LoginAPI } from '../services';
import { APIError } from '../types';
import { useAuth } from '../hooks';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  console.log("here",isAuthenticated);


  const handleSubmit: SubmitHandler<LoginData> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      
      const response = await LoginAPI(data);
      const responseData = response.data as LoginResponse;
      login({ accessToken: responseData.accessToken, refreshToken: responseData.refreshToken });

      navigate('/application');
    } catch (err) {
      const error = err as APIError;
      setError(error.message || 'Unable to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />;
};

export default SignIn;
