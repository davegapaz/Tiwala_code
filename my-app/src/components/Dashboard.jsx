// Main dashboard component for Tiwala app
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTiwala } from '@/context/TiwalaContext';
import { TiwalaIndexDisplay } from './TiwalaIndexDisplay';
import { ReferralModal } from './ReferralModal';
import { CommunityView } from './CommunityView';
import { MoneyTips } from './MoneyTips';
import { EnhancedMoneyTips } from './EnhancedMoneyTips';
import { CommunitySupport } from './CommunitySupport';
import { OnboardingFlow } from './OnboardingFlow';
import { NotificationPanel } from './NotificationPanel';
import { tagalogStrings } from '@/data/tagalog-strings';
import { 
  Users, 
  Plus, 
  BookOpen, 
  TrendingUp,
  Bell,
  ArrowLeft
} from 'lucide-react';
import heroImage from '@/assets/hero-rice-field.jpg';

// Remove type alias and use string literals for view state
export function Dashboard() {
  const { state, actions } = useTiwala();
  const [currentView, setCurrentView] = useState('home');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [supportUserId, setSupportUserId] = useState('');
  
  if (!state.currentUser) return null;
  
  const user = state.currentUser;
  const canRefer = user.tiwalaIndex >= 700 && user.monthlyReferrals < 3;
  const unreadNotifications = state.notifications.filter(n => !n.read).length;
  
  const handleBack = () => {
    setCurrentView('home');
  };
  
  const handleNavigateToSupport = (userId) => {
    setSupportUserId(userId);
    setCurrentView('support');
  };
  
  const renderBackButton = () => (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="mb-4 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {tagalogStrings.ui.back}
    </Button>
  );
  
  // Render different views
  if (currentView === 'community') {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-4xl mx-auto">
          {renderBackButton()}
          <CommunityView />
        </div>
      </div>
    );
  }
  
  if (currentView === 'tips') {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="max-w-4xl mx-auto">
          {renderBackButton()}
          <EnhancedMoneyTips />
        </div>
      </div>
    );
  }
  
  if (currentView === 'support') {
    return <CommunitySupport strugglingUserId={supportUserId} onBack={handleBack} />;
  }
  
  if (currentView === 'onboarding') {
    return <OnboardingFlow onComplete={handleBack} />;
  }
  
  return (
    <div className="min-h-screen bg-background-soft font-poppins">
      {/* Modern Header */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Rice Fields"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tiwala-red/85 to-tiwala-red/20" />
        
        {/* Modern Header Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 mr-4">
              <h1 className="text-xl sm:text-2xl font-semibold font-poppins leading-tight">
                {tagalogStrings.dashboard.welcome}, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-white/90 text-xs sm:text-sm font-poppins mt-1">
                {user.location} • Miyembro simula {new Date(user.joinedDate).toLocaleDateString('tl-PH')}
              </p>
            </div>
            
            {/* Notifications */}
            <NotificationPanel onNavigateToSupport={handleNavigateToSupport} />
          </div>
          
          <div className="text-center">
            <div className="text-xs sm:text-sm opacity-90 mb-1 font-poppins">{tagalogStrings.dashboard.yourLevel}</div>
            <div className="text-2xl sm:text-3xl font-bold font-poppins">{user.antas}</div>
          </div>
        </div>
      </div>
      
      {/* Modern Main Content */}
      <div className="px-4 py-16 -mt-12 relative z-10 max-w-md mx-auto">
        {/* Tiwala Index Card - Hero */}
        <div className="mb-6">
          <TiwalaIndexDisplay user={user} />
        </div>
        
        {/* Modern Action Cards */}
        <div className="space-y-4 mb-6">
          {/* Referral Card */}
          <div className="glass-card rounded-2xl p-4 shadow-card-hover border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-tiwala-red to-tiwala-gold rounded-xl shadow-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base font-poppins text-foreground">
                  {tagalogStrings.dashboard.referFriend}
                </h3>
                <p className="text-xs text-foreground-muted font-poppins mt-1 leading-tight">
                  {canRefer 
                    ? `Maaari pa kayong mag-refer ng ${3 - user.monthlyReferrals} tao ngayong buwan`
                    : user.tiwalaIndex < 700 
                      ? tagalogStrings.referral.requirement700
                      : "Naabot na ang limitasyon ngayong buwan (3)"
                  }
                </p>
              </div>
              <Button 
                onClick={() => setShowReferralModal(true)}
                disabled={!canRefer}
                className="btn-modern bg-tiwala-red hover:bg-tiwala-red/90 text-white text-[13px] px-2 py-1"
              >
                Mag-refer
              </Button>
            </div>
          </div>
          
          {/* Community Card */}
          <div className="glass-card rounded-2xl p-4 shadow-card-hover border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-tiwala-gold to-yellow-400 rounded-xl shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base font-poppins text-foreground">
                  {tagalogStrings.dashboard.viewCommunity}
                </h3>
                <p className="text-xs text-foreground-muted font-poppins mt-1">
                  {user.directReferrals} {tagalogStrings.dashboard.directReferrals}
                </p>
              </div>
              <Button 
                onClick={() => setCurrentView('community')}
                className="btn-modern border border-tiwala-gold text-tiwala-gold hover:bg-tiwala-gold text-[13px] hover:text-white bg-transparent px-2 py-2"
              >
                Tingnan
              </Button>
            </div>
          </div>
          
          {/* Money Tips Card */}
          <div className="glass-card rounded-2xl p-4 shadow-card-hover border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-tiwala-green to-emerald-400 rounded-xl shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base font-poppins text-foreground">
                  {tagalogStrings.dashboard.moneyTips}
                </h3>
                <p className="text-xs text-foreground-muted font-poppins mt-1">
                  Gabay sa maayos na pamamahala ng pera
                </p>
              </div>
              <Button 
                onClick={() => setCurrentView('tips')}
                className="btn-modern border border-tiwala-green text-tiwala-green hover:bg-tiwala-green hover:text-white bg-transparent text-[13px] px-2 py-1"
              >
                Basahin
              </Button>
            </div>
          </div>
        </div>
        
        {/* Modern Quick Stats */}
        <div className="glass-card rounded-2xl p-4 shadow-card-hover border-0 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-tiwala-gold" />
            <h2 className="font-semibold text-lg font-poppins text-foreground">Mga Estadistika</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 bg-gradient-to-br from-tiwala-green/10 to-tiwala-green/5 rounded-xl">
              <div className="text-2xl font-bold text-tiwala-green font-poppins">{user.onTimePayments}</div>
              <div className="text-xs text-foreground-muted font-poppins mt-1">On-time na Bayad</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-tiwala-gold/10 to-tiwala-gold/5 rounded-xl">
              <div className="text-2xl font-bold text-tiwala-gold font-poppins">{user.totalReferrals}</div>
              <div className="text-xs text-foreground-muted font-poppins mt-1">Kabuuang Referral</div>
            </div>
          </div>
        </div>
        
        {/* Demo Controls */}
        <div className="glass-card rounded-2xl p-4 shadow-card border-0 bg-background-soft/50">
          <h3 className="text-sm font-medium font-poppins text-foreground-muted mb-3">Demo Controls (Hackathon)</h3>
          
          <div className="space-y-3">
            <Button 
              onClick={() => actions.updateTiwalaIndex(15, "On-time payment")}
              className="w-full btn-modern border border-tiwala-green text-tiwala-green hover:bg-tiwala-green hover:text-white bg-transparent text-sm"
            >
              I-simulate ang On-time Payment (+15)
            </Button>
            {user.name === "Maria Santos" && (
              <>
                <Button 
                  onClick={() => actions.triggerSupportRequest("carlos")}
                  className="w-full btn-modern border border-tiwala-red text-tiwala-red hover:bg-tiwala-red hover:text-white bg-transparent text-sm"
                >
                  I-simulate: Si Carlos ay nangangailangan ng tulong
                </Button>
                <Button 
                  onClick={() => setCurrentView('onboarding')}
                  className="w-full btn-modern border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-transparent text-sm"
                >
                  Demo: New User Onboarding
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Referral Modal */}
      <ReferralModal 
        open={showReferralModal}
        onOpenChange={setShowReferralModal}
      />
    </div>
  );
}