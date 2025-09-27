import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { isFirebaseConfigured } from '@/lib/firebase';
import { Recycle, Users, Shield } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Recycle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-primary">CleanConnect</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Efficient Garbage Collection Management
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Modern Garbage Collection 
                <span className="text-primary block">Made Simple</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect residents, cleaners, and administrators in one seamless platform. 
                Efficient waste management for cleaner communities.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">For Residents</h3>
                <p className="text-sm text-muted-foreground">Easy pickup requests with real-time tracking</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto">
                  <Recycle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">For Cleaners</h3>
                <p className="text-sm text-muted-foreground">Organized job assignments and completion tracking</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">For Admins</h3>
                <p className="text-sm text-muted-foreground">Complete oversight and management control</p>
              </div>
            </div>

            {/* Firebase Notice */}
            {!isFirebaseConfigured && (
              <Card className="bg-accent/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Firebase Setup Required</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        To use CleanConnect, you need to configure Firebase with:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Authentication (Email/Password)</li>
                        <li>• Firestore Database</li>
                        <li>• Storage (for photo uploads)</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-3">
                        Update the Firebase configuration in <code className="bg-muted px-1 rounded">src/lib/firebase.ts</code>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Hero Image & Auth */}
          <div className="space-y-8">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Clean city environment with organized waste management"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>

            {/* Auth Form */}
            <div className="max-w-md mx-auto">
              <AuthForm onSuccess={() => window.location.reload()} />
            </div>
          </div>
        </div>

        {/* How it Works */}
        <section className="mt-20 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">How CleanConnect Works</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to efficient waste management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-status-pending/10 p-3 rounded-lg w-fit mx-auto">
                  <span className="text-2xl font-bold text-status-pending">1</span>
                </div>
                <CardTitle>Request Pickup</CardTitle>
                <CardDescription>
                  Residents create pickup requests with location and description
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-status-assigned/10 p-3 rounded-lg w-fit mx-auto">
                  <span className="text-2xl font-bold text-status-assigned">2</span>
                </div>
                <CardTitle>Assign Cleaner</CardTitle>
                <CardDescription>
                  Admins review and assign requests to available cleaners
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-status-completed/10 p-3 rounded-lg w-fit mx-auto">
                  <span className="text-2xl font-bold text-status-completed">3</span>
                </div>
                <CardTitle>Complete Job</CardTitle>
                <CardDescription>
                  Cleaners mark jobs as completed with optional photo proof
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            CleanConnect - Built with React, Firebase & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
