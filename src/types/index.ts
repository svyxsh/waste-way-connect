export interface User {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'cleaner' | 'admin';
}

export interface GarbageRequest {
  id: string;
  residentId: string;
  residentName: string;
  description: string;
  photoUrl?: string;
  location: string;
  status: 'pending' | 'assigned' | 'completed';
  cleanerId?: string;
  cleanerName?: string;
  createdAt: Date;
  updatedAt: Date;
  completionPhotoUrl?: string;
}

export type UserRole = 'resident' | 'cleaner' | 'admin';