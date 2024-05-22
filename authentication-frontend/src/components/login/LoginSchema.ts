import * as yup from 'yup';

export const LoginSchema = yup.object({
    email: yup.string().required("Email is required").email("Email must be a valid email"),
    password: yup.string().required("Password is required")
  }).required();