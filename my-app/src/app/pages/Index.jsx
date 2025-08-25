// Main Tiwala app entry point
import React from 'react';
import { UserSelector } from '@/components/UserSelector';
import { Dashboard } from '@/components/Dashboard';
import { useTiwala } from '@/context/TiwalaContext';

const Index = () => {
  const { state } = useTiwala();
  
  // Show user selector if no user is selected, otherwise show dashboard
  if (!state.currentUser) {
    return <UserSelector />;
  }
  
  return <Dashboard />;
};

export default Index;
