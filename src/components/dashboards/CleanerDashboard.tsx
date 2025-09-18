import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { GarbageRequest } from '@/types';
import { MapPin, Calendar, User, CheckCircle } from 'lucide-react';

// Mock data for demonstration
const mockAssignedRequests: GarbageRequest[] = [
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
  {
    id: '3',
    residentId: 'user2',
    residentName: 'Alice Johnson',
    description: 'Old electronics and cables',
    location: '456 Oak Ave, House 12',
    status: 'assigned',
    cleanerId: 'cleaner1',
    cleanerName: 'Jane Smith',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

export const CleanerDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleMarkCompleted = (requestId: string) => {
    // TODO: Implement Firebase status update
    console.log('Marking request as completed:', requestId);
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
          <h2 className="text-3xl font-bold">Cleaner Dashboard</h2>
          <div className="flex items-center gap-4">
            <Badge variant="assigned" className="text-lg px-3 py-1">
              {mockAssignedRequests.length} Active Jobs
            </Badge>
          </div>
        </div>

        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">Assigned Requests</h3>
          {mockAssignedRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assigned requests at the moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  New requests will appear here when assigned by admin
                </p>
              </CardContent>
            </Card>
          ) : (
            mockAssignedRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {request.location}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <User className="h-4 w-4" />
                        Resident: {request.residentName}
                      </CardDescription>
                    </div>
                    <Badge variant="assigned">Assigned</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{request.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Assigned: {request.updatedAt.toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="completed" 
                        onClick={() => handleMarkCompleted(request.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Completed
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};