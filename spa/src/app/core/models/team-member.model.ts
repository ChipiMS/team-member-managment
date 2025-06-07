import { Role } from './role.model';

export interface TeamMember {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role?: Role;
  created_at?: string;
  updated_at?: string;
} 