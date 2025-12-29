export interface User {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'cleaner' | 'admin';
}

export interface GarbageRequest {
  id: string;
  resident_id: string;
  residentName: string;
  description: string;
  photoUrl?: string;
  location: string;
  status: 'pending' | 'assigned' | 'completed';
  cleaner_id?: string;
  cleanerName?: string;
  createdAt: Date;
  updatedAt: Date;
  completionPhotoUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type UserRole = 'resident' | 'cleaner' | 'admin';