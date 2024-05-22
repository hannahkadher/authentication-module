import { LoginResponse } from './login-response';
import { SignUpResponse } from './signup-response';

export interface ApiResponse {
  code: number;
  data: LoginResponse | SignUpResponse;
  message: string;
}
