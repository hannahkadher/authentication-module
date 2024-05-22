import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/signup';
import { SignUpAPI } from '../services';
import { APIError, User } from '../types';
import { SubmitHandler } from 'react-hook-form';

const SignUpContainer: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<User> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      console.log(data);
      await SignUpAPI(data);
      navigate('/application');
    } catch (err) {
      const error = err as APIError;
      setError(error?.message || 'Unable to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return <SignUpForm onSubmit={handleSubmit} loading={loading} error={error} />;
};

export default SignUpContainer;
