import * as yup from 'yup';

export const signUpSchema = yup
  .object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    name: yup.string().required('Name is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
        'Password must include at least one letter, one number, and one special character',
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  })
  .required();
