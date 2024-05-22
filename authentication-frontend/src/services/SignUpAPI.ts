import { BASE_URL } from '../config';
import { APIError, ApiResponse, User } from '../types';

export const SignUpAPI = async (user: User): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiResponse;
      const error: APIError = {
        message: errorData.message || 'Unable to sign up.',
        status: response.status,
      };
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};
