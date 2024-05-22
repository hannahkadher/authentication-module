import { User } from "./user";

export interface SignUpFormData extends User {
  confirmPassword: string;  
}