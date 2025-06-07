export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  startDate: Date;
  status: 'active' | 'inactive';
  avatar?: string;
} 