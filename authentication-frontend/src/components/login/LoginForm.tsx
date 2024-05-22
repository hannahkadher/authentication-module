import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Box, Typography, Link } from '@mui/material';

import { LoginData } from '../../types/login';

import { LoginSchema } from './LoginSchema';
import FormTextField from '../form-text-field';
import '../../styles/FormStyles.scss';
import FormHeader from '../form-header';
import FormErrorMessage from '../form-error';
import PasswordField from '../password-field';
import FormButton from '../form-button';
import { useCustomForm } from '../../hooks';

interface LoginFormProps {
  onSubmit: SubmitHandler<LoginData>;
  loading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useCustomForm(LoginSchema);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit: SubmitHandler<LoginData> = (data) => {
    onSubmit(data);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="form-container">
      <FormHeader />
      <main className="form-main">
        <Typography component="h1" variant="h5" gutterBottom>
          Welcome back
        </Typography>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} className="form-box">
          <Typography component="h2" variant="h6" gutterBottom>
            Sign in
          </Typography>
          <FormTextField
            name="email"
            control={control}
            label="Email Address"
            type="email"
            defaultValue=""
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
          <PasswordField
            name="password"
            control={control}
            label="Password"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
          />
          <div className="form-footer">
            <Link href="/sign-up" variant="body2">
              Sign up now
            </Link>
          </div>
          <FormButton type="submit" fullWidth variant="contained" disabled={loading || isSubmitting}>
            Sign In
          </FormButton>
          <FormErrorMessage error={error} />
        </Box>
      </main>
    </div>
  );
};

export default LoginForm;
