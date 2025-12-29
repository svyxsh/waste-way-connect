import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { GarbageRequest } from '@/types';
import { MapPin, Calendar, User, CheckCircle, Navigation } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import RequestMap from '@/components/ui/RequestMap';

export const CleanerDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [assignedRequests, setAssignedRequests] = useState<GarbageRequest[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const requestsQuery = query(
      collection(db, 'garbage_requests'),
      where('cleaner_id', '==', currentUser.id),
      where('status', '==', 'assigned')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as GarbageRequest;
      }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      setAssignedRequests(requestsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleMarkCompleted = async (requestId: string) => {
    const requestDocRef = doc(db, 'garbage_requests', requestId);
    try {
      await updateDoc(requestDocRef, {
        status: 'completed',
        updatedAt: new Date(),
      });
      console.log('Request marked as completed');
    } catch (error) {
      console.error("Error updating request: ", error);
    }
  };

  const handleNavigate = (latitude: number, longitude: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
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
              {assignedRequests.length} Active Jobs
            </Badge>
          </div>
        </div>

        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">Assigned Requests</h3>
          {assignedRequests.length === 0 ? (
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
            assignedRequests.map((request) => (
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
                    
                    {request.coordinates && (
                      <RequestMap latitude={request.coordinates.latitude} longitude={request.coordinates.longitude} />
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Assigned: {new Date(request.updatedAt).toLocaleDateString()}</span>
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
                      {request.coordinates && (
                        <Button 
                          variant="outline"
                          onClick={() => handleNavigate(request.coordinates.latitude, request.coordinates.longitude)}
                          className="gap-2"
                        >
                          <Navigation className="h-4 w-4" />
                          Navigate
                        </Button>
                      )}
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
