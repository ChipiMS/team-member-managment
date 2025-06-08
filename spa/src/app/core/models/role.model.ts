import { Permission } from './permission.model';

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
} 