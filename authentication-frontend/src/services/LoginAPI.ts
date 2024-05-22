import { BASE_URL } from '../config';
import { ApiResponse, LoginData } from '../types';

export const LoginAPI = async (data: LoginData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message?.message || 'Unable to login.');
    }

    return await response.json() as ApiResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
