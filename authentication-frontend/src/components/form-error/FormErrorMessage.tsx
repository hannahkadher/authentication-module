import React from 'react';
import { Typography } from '@mui/material';

interface ErrorMessageProps {
  error: string | null;
}

const FormErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  error ? <Typography className="error-message" variant="body2">{error}</Typography> : null
);

export default FormErrorMessage;