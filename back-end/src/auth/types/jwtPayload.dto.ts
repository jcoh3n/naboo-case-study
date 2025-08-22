export type PayloadDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Added role to support admin-specific features like debug mode
  role: 'user' | 'admin';
};
