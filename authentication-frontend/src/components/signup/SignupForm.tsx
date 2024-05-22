import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Box, Typography, Link } from '@mui/material';
import { User, SignUpFormData } from '../../types';
import { signUpSchema } from './SignUpSchema';
import { useCustomForm } from '../../hooks/useCustomForm';
import FormTextField from '../form-text-field';
import '../../styles/FormStyles.scss';
import FormHeader from '../form-header';
import FormErrorMessage from '../form-error';
import PasswordField from '../password-field';
import FormButton from '../form-button';

interface SignUpFormProps {
  onSubmit: SubmitHandler<User>;
  loading: boolean;
  error: string | null;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, loading, error }) => {
  const {
    control: signUpControl,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useCustomForm(signUpSchema);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormSubmit: SubmitHandler<SignUpFormData> = (data) => {
    const { confirmPassword, ...submitData } = data;
    onSubmit(submitData);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <div className="form-container">
      <FormHeader />
      <main className="form-main">
        <Typography component="h1" variant="h5" gutterBottom>
          Welcome
        </Typography>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} className="form-box">
          <Typography component="h2" variant="h6" gutterBottom>
            Sign Up
          </Typography>
          <FormTextField
            name="email"
            control={signUpControl}
            label="Email Address"
            type="email"
            defaultValue=""
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
          <FormTextField
            name="name"
            control={signUpControl}
            label="Name"
            type="text"
            defaultValue=""
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
          />
          <PasswordField
            name="password"
            control={signUpControl}
            label="Password"
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
          <PasswordField
            name="confirmPassword"
            control={signUpControl}
            label="Confirm Password"
            showPassword={showConfirmPassword}
            toggleShowPassword={toggleShowConfirmPassword}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
          />
          <div className="form-footer">
            <Link href="/login" variant="body2">
              Already a member?
            </Link>
          </div>
          <FormButton type="submit" fullWidth variant="contained" disabled={loading || isSubmitting}>
            Sign Up
          </FormButton>
          <FormErrorMessage error={error} />
        </Box>
      </main>
    </div>
  );
};

export default SignUpForm;
