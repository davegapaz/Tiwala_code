// Community view component showing user referrals
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTiwala } from '@/context/TiwalaContext';
import { tagalogStrings } from '@/data/tagalog-strings';
import { UserReferral } from '@/data/demo-users';
import { 
  Users, 
  Calendar, 
  Phone, 
  Heart,
  AlertTriangle,
  TrendingUp,
  PiggyBank,
  PersonStanding,
  PersonStandingIcon
} from 'lucide-react';
import communityImage from '@/assets/community-meeting.jpg';

export function CommunityView() {
  const { state, actions } = useTiwala();
  
  if (!state.currentUser) return null;
  
  const user = state.currentUser;
  const referrals = user.referrals;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-accent text-white';
      case 'needs_support': return 'bg-warning text-white';
      case 'defaulted': return 'bg-destructive text-white';
      default: return 'bg-muted';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktibo';
      case 'needs_support': return 'Nanganganib';
      case 'defaulted': return 'Nagkaproblema';
      default: return 'Unknown';
    }
  };
  
  const handleSendSupport = (referralId) => {
    actions.sendSupport(referralId);
  };
  
  return (
    <div className="mt-6">
  <h2 className="text-lg font-bold mb-2">Mga Referral</h2>
  {user.referrals && user.referrals.length > 0 ? (
    <div className="space-y-4">
      {user.referrals.map((referral) => (
        <div
          key={referral.id}
          className="bg-white rounded-xl shadow-md p-4 flex items-center"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
            {referral.profileImage || "👤"}
          </div>
          <div>
            <h3 className="font-semibold text-[16px]">{referral.name}</h3>
            <p className="text-[13px] text-muted-foreground">
              {referral.location || "Walang lokasyon"}
            </p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      Walang referrals ang magsasaka na ito.
    </p>
  )}
      
      {/* Demo Controls for Carlos */}
      {user.name === "Maria Santos" && (
        <Card className="shadow-card border-0 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Demo Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => actions.triggerSupportRequest("carlos")}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              I-simulate: Carlos nangangailangan ng tulong
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}