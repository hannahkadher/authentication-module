// useCustomForm.ts
import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export function useCustomForm<T extends yup.AnyObjectSchema>(schema: T): UseFormReturn<yup.Asserts<T>> & {
  showPassword: boolean;
  toggleShowPassword: () => void;
} {
  const [showPassword, setShowPassword] = useState(false);

  const formMethods = useForm<yup.Asserts<T>>({
    resolver: yupResolver(schema),
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return {
    ...formMethods,
    showPassword,
    toggleShowPassword,
  };
}
