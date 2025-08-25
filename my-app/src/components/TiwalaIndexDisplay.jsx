// Modern Tiwala Index display with plant growth visualization
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateAntas } from '@/data/demo-users';
import { tagalogStrings } from '@/data/tagalog-strings';
import { PlantGrowthIcon, getPlantStage, getPlantStageName } from './PlantGrowthIcon';

// Removed TypeScript interface and type annotation
export function TiwalaIndexDisplay({ user, showAnimation = true }) {
  const antas = calculateAntas(user.tiwalaIndex);
  const plantStage = getPlantStage(user.tiwalaIndex);
  const plantStageName = getPlantStageName(plantStage);
  
  // Calculate progress to next level
  const getProgressToNextLevel = (index) => {
    if (index >= 850) return 100;
    if (index >= 700) return ((index - 700) / 150) * 100;
    if (index >= 500) return ((index - 500) / 200) * 100;
    return (index / 500) * 100;
  };
  
  const getNextLevelThreshold = (index) => {
    if (index >= 850) return 850;
    if (index >= 700) return 850;
    if (index >= 500) return 700;
    return 500;
  };
  
  const progress = getProgressToNextLevel(user.tiwalaIndex);
  const nextThreshold = getNextLevelThreshold(user.tiwalaIndex);
  
  return (
    <div className="glass-card rounded-2xl p-6 shadow-card-hover border-0 overflow-hidden">
      <div className="text-center space-y-6">
        {/* Plant Growth Visual - Hero Element */}
        <div className="relative">
          {/* <PlantGrowthIcon 
            stage={plantStage}
            size={80}
            className={showAnimation ? 'animate-bounce-in' : ''}
          /> */}
          <div className="mt-4">
            <div className="text-4xl font-bold text-foreground font-poppins mb-1">
              {user.tiwalaIndex}
            </div>
            <div className="text-sm font-medium text-foreground-muted uppercase tracking-wide font-poppins">
              {tagalogStrings.dashboard.tiwalaIndex}
            </div>
          </div>
        </div>
        
        {/* Stage Badge */}
        <div className="flex justify-center">
          <Badge 
            className="bg-gradient-to-r from-tiwala-red to-tiwala-gold text-white px-6 py-2 text-base font-semibold font-poppins shadow-lg rounded-full"
          >
            {antas}
          </Badge>
        </div>
          
        {/* Modern Progress Bar */}
        {user.tiwalaIndex < 850 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-foreground-muted font-poppins">
              <span>Progreso sa susunod na antas</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-background-soft rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-tiwala-red to-tiwala-gold transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-xs text-foreground-muted font-poppins">
              {nextThreshold - user.tiwalaIndex} points hanggang sa susunod na antas
            </div>
          </div>
        )}
          
        {/* Modern Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center p-3 bg-gradient-to-br from-tiwala-green/10 to-tiwala-green/5 rounded-xl">
            <div className="text-xl font-bold text-tiwala-green font-poppins">
              {user.onTimePayments}
            </div>
            <div className="text-xs text-foreground-muted font-poppins mt-1">
              {tagalogStrings.dashboard.onTimePayments}
            </div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-tiwala-gold/10 to-tiwala-gold/5 rounded-xl">
            <div className="text-xl font-bold text-tiwala-gold font-poppins">
              {user.directReferrals}
            </div>
            <div className="text-xs text-foreground-muted font-poppins mt-1">
              Referrals
            </div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-tiwala-red/10 to-tiwala-red/5 rounded-xl">
            <div className="text-xl font-bold text-tiwala-red font-poppins">
              {user.monthlyReferrals}/3
            </div>
            <div className="text-xs text-foreground-muted font-poppins mt-1">
              Ngayong buwan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}