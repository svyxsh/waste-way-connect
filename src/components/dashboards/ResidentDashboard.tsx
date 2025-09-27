import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { GarbageRequest } from '@/types';
import { Plus, MapPin, Calendar, User, Loader2 } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import LocationPicker from '@/components/ui/LocationPicker';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';

export const ResidentDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [requests, setRequests] = useState<GarbageRequest[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Submitting...');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    description: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, 'garbage_requests'),
        where('resident_id', '==', currentUser.id)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requestsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as GarbageRequest;
        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setRequests(requestsData);
      }, (error) => {
        console.error('Error fetching requests:', error);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleLocationSelect = useCallback((location: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, latitude: location.lat, longitude: location.lng }));
  }, []);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formData.latitude || !formData.longitude) {
      alert("Please select a location on the map.");
      return;
    }
    if (!formData.description) {
      alert("Please enter a description.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Starting...');
    setUploadProgress(0);

    try {
      let photoUrl = '';
      if (imageFile) {
        setLoadingMessage('Compressing image...');
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);

        setLoadingMessage('Uploading image...');
        const imageRef = ref(storage, `garbage-images/${currentUser.id}-${Date.now()}`);
        const uploadTask = uploadBytesResumable(imageRef, compressedFile);

        photoUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      }

      setLoadingMessage('Finalizing request...');
      await addDoc(collection(db, 'garbage_requests'), {
        resident_id: currentUser.id,
        residentName: currentUser.name,
        description: formData.description,
        location: `Location from map (${formData.latitude.toFixed(5)}, ${formData.longitude.toFixed(5)})`,
        status: 'pending',
        createdAt: serverTimestamp(),
        coordinates: new GeoPoint(formData.latitude, formData.longitude),
        photoUrl: photoUrl,
      });

      // Reset form state
      setFormData({ description: '', latitude: null, longitude: null });
      setImageFile(null);
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Error creating request:', error);
      alert(`Failed to create request. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = { pending: 'pending', assigned: 'assigned', completed: 'completed' } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <header className="bg-card border-b p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">CleanConnect</h1>
            <p className="text-muted-foreground">Welcome, {currentUser?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>Sign Out</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Resident Dashboard</h2>
            <SheetTrigger asChild><Button variant="hero" className="gap-2"><Plus className="h-4 w-4" />New Pickup Request</Button></SheetTrigger>
          </div>

          <div className="grid gap-4">
            <h3 className="text-xl font-semibold">Your Requests</h3>
            {requests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No pickup requests yet</p>
                  <SheetTrigger asChild><Button variant="hero" className="mt-4">Create Your First Request</Button></SheetTrigger>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[70vh] rounded-md border p-4">
                <ul className="grid gap-4">
                  {requests.map((request) => (
                    <li key={request.id}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg"><MapPin className="h-5 w-5 text-primary" /></div>
                              <div>
                                {request.coordinates ? (
                                  <a href={`https://www.google.com/maps?q=${request.coordinates.latitude},${request.coordinates.longitude}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">{request.location}</a>
                                ) : (
                                  <p className="font-medium">{request.location}</p>
                                )}
                                <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(request.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-muted-foreground mb-3">{request.description}</p>
                          {request.photoUrl && <img src={request.photoUrl} alt="Garbage" className="rounded-md max-h-48 w-auto mt-2" />}
                          {request.status === 'assigned' && request.cleanerName && (
                            <div className="flex items-center gap-2 text-sm mt-3"><User className="h-4 w-4" /><span>Assigned to: <strong>{request.cleanerName}</strong></span></div>
                          )}
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
          
          <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col">
            <SheetHeader>
              <SheetTitle>Create Pickup Request</SheetTitle>
              <SheetDescription>Describe your garbage pickup needs and set the location on the map.</SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-grow p-1">
              <form id="pickup-request-form" onSubmit={handleSubmitRequest} className="space-y-4 py-4 pr-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Photo of Garbage (Optional)</label>
                  <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="file:text-primary file:font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe what needs to be collected (furniture, boxes, organic waste, etc.)" required rows={5} />
                </div>
              </form>
            </ScrollArea>
            <SheetFooter className="pt-4">
              {isLoading && (
                <div className="w-full flex items-center gap-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <span className="text-sm whitespace-nowrap">{Math.round(uploadProgress)}%</span>
                </div>
              )}
              <SheetClose asChild><Button type="button" variant="outline" disabled={isLoading}>Cancel</Button></SheetClose>
              <Button type="submit" variant="hero" form="pickup-request-form" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? loadingMessage : 'Submit Request'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};