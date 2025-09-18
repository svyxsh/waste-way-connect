import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { GarbageRequest } from '@/types';
import { Plus, MapPin, Calendar, User } from 'lucide-react';

// Mock data for demonstration
const mockRequests: GarbageRequest[] = [
  {
    id: '1',
    residentId: 'user1',
    residentName: 'John Doe',
    description: 'Large furniture items and boxes need pickup',
    location: '123 Main St, Apt 4B',
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    residentId: 'user1',
    residentName: 'John Doe',
    description: 'Garden waste and organic materials',
    location: '123 Main St, Apt 4B',
    status: 'assigned',
    cleanerId: 'cleaner1',
    cleanerName: 'Jane Smith',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
];

export const ResidentDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Firebase request creation
    console.log('Creating request:', formData);
    setFormData({ description: '', location: '' });
    setShowRequestForm(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'pending',
      assigned: 'assigned', 
      completed: 'completed'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <header className="bg-card border-b p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">CleanConnect</h1>
            <p className="text-muted-foreground">Welcome, {currentUser?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Resident Dashboard</h2>
          <Button 
            variant="hero" 
            onClick={() => setShowRequestForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Pickup Request
          </Button>
        </div>

        {showRequestForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create Pickup Request</CardTitle>
              <CardDescription>
                Describe your garbage pickup needs and we'll assign a cleaner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter pickup address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what needs to be collected (furniture, boxes, organic waste, etc.)"
                    required
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="hero">
                    Submit Request
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowRequestForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">Your Requests</h3>
          {mockRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No pickup requests yet</p>
                <Button 
                  variant="hero" 
                  onClick={() => setShowRequestForm(true)}
                  className="mt-4"
                >
                  Create Your First Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            mockRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{request.location}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{request.description}</p>
                  
                  {request.status === 'assigned' && request.cleanerName && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>Assigned to: <strong>{request.cleanerName}</strong></span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};