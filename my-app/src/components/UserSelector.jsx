// User selection screen for demo purposes
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { demoUsers } from '@/data/demo-users';
import { tagalogStrings } from '@/data/tagalog-strings';
import { useTiwala } from '@/context/TiwalaContext';
import heroImage from '@/assets/hero-rice-field.jpg';
import Image from 'next/image';

export function UserSelector() {
  const { actions } = useTiwala();
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // This function runs when the component loads
    const fetchAndSetFarmers = async () => {
      try {
        const response = await fetch('/api/getFarmers');
        if (!response.ok) {
          throw new Error('Could not fetch farmer data.');
        }
        const data = await response.json();
        setFarmers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetFarmers();
  }, []); // The empty [] means this effect runs once

  const handleSelectUser = (userId) => {
    actions.setCurrentUser(userId);
  };

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center text-xl">Naglo-load ng mga magsasaka...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-xl text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={heroImage} 
          alt="Filipino Rice Fields"
          width={1200}
          height={400}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tiwala-red/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
            {tagalogStrings.appName}
          </h1>
          <p className="text-xl text-white/90 animate-slide-up">
            {tagalogStrings.tagline}
          </p>
        </div>
      </div>
      
      {/* User Selection */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {tagalogStrings.selectUser}
          </h2>
          <p className="text-muted-foreground">
            {tagalogStrings.selectUserSubtitle}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {farmers.map((user, index) => (
            <Card 
              key={user.id} 
              className="shadow-card hover:shadow-tiwala transition-all duration-300 hover:scale-105 animate-bounce-in border-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">{user.profileImage}</div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-tiwala-red font-semibold">{user.antas}</span>
                  <span>•</span>
                  <span>{user.location}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-tiwala-red">
                    {user.tiwalaIndex}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tagalogStrings.dashboard.tiwalaIndex}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-surface rounded-lg">
                    <div className="font-semibold text-tiwala-gold">{user.directReferrals}</div>
                    <div className="text-muted-foreground">Referrals</div>
                  </div>
                  <div className="text-center p-2 bg-surface rounded-lg">
                    <div className="font-semibold text-accent">{user.onTimePayments}</div>
                    <div className="text-muted-foreground">On-time</div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSelectUser(user.id)}
                  variant="tiwala"
                  className="w-full bg-red-400"
                >
                  Pumili bilang {user.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Hackathon Demo - Walang tunay na authentication
        </div>
      </div>
    </div>
  );
}