import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { GarbageRequest, UserProfile } from '@/types';
import { MapPin, Calendar, User, Users, ClipboardList, TrendingUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, where } from 'firebase/firestore';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [allRequests, setAllRequests] = useState<GarbageRequest[]>([]);
  const [cleaners, setCleaners] = useState<UserProfile[]>([]);
  const [selectedCleaner, setSelectedCleaner] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const requestsQuery = query(collection(db, 'garbage_requests'), orderBy('createdAt', 'desc'));
    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as GarbageRequest;
      });
      setAllRequests(requestsData);
    });

    const cleanersQuery = query(collection(db, 'users'), where('role', '==', 'cleaner'));
    const unsubscribeCleaners = onSnapshot(cleanersQuery, (snapshot) => {
      const cleanersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
      setCleaners(cleanersData);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeCleaners();
    };
  }, []);

  const handleAssignCleaner = async (requestId: string, cleanerId: string) => {
    const cleaner = cleaners.find(c => c.id === cleanerId);
    if (!cleaner) {
      console.error("Selected cleaner not found");
      return;
    }

    const requestDocRef = doc(db, 'garbage_requests', requestId);
    try {
      await updateDoc(requestDocRef, {
        cleaner_id: cleaner.id,
        cleanerName: cleaner.name,
        status: 'assigned',
        updatedAt: new Date(),
      });
      console.log('Request assigned successfully');
    } catch (error) {
      console.error("Error assigning request: ", error);
    }
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

  const stats = {
    totalRequests: allRequests.length,
    pending: allRequests.filter(r => r.status === 'pending').length,
    assigned: allRequests.filter(r => r.status === 'assigned').length,
    completed: allRequests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <header className="bg-card border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">CleanConnect Admin</h1>
            <p className="text-muted-foreground">Welcome, {currentUser?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                  <p className="text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-status-pending/10 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-status-pending" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-status-assigned/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-status-assigned" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.assigned}</p>
                  <p className="text-muted-foreground">Assigned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-status-completed/10 p-3 rounded-lg">
                  <User className="h-6 w-6 text-status-completed" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Requests */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">All Requests</h3>
          <div className="grid gap-4">
            {allRequests.map((request) => (
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
                          <User className="h-3 w-3" />
                          {request.residentName}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{request.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {request.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <Select 
                          value={selectedCleaner[request.id] || ''} 
                          onValueChange={(value) => setSelectedCleaner(prev => ({ ...prev, [request.id]: value }))}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Assign cleaner" />
                          </SelectTrigger>
                          <SelectContent>
                            {cleaners.map((cleaner) => (
                              <SelectItem key={cleaner.id} value={cleaner.id}>
                                {cleaner.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="assigned" 
                          onClick={() => selectedCleaner[request.id] && handleAssignCleaner(request.id, selectedCleaner[request.id])}
                          disabled={!selectedCleaner[request.id]}
                        >
                          Assign
                        </Button>
                      </div>
                    ) : request.status === 'assigned' && request.cleanerName ? (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Assigned to: </span>
                        <strong>{request.cleanerName}</strong>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Completed by: </span>
                        <strong>{request.cleanerName}</strong>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};