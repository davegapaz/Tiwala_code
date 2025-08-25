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
    <div className="space-y-2">
      {/* Header */}
      <div className="relative h-40 overflow-hidden rounded-lg">
        <img 
          src={communityImage} 
          alt="Community Meeting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tiwala-red/90 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
          <Users className="h-8 w-8 mb-2" />
          <h1 className="text-2xl font-bold">
            {tagalogStrings.community.title}
          </h1>
          <p className="text-white/90 text-sm mt-2">
            {tagalogStrings.community.subtitle}
          </p>
        </div>
      </div>
      
      {/* Stats Overview */}
      <Card className="shadow-card border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-tiwala-gold">
                {referrals.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Kabuuang Referral
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {referrals.filter(r => r.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Aktibong Miyembro
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">
                {referrals.filter(r => r.status === 'needs_support').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Kailangan ng Tulong
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Community Members */}
      {referrals.length === 0 ? (
        <Card className="shadow-card border-0">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {tagalogStrings.community.noReferrals}
            </h3>
            <p className="text-muted-foreground">
              Magsimula ng pag-refer ng mga kaibigan at kapamilya para makatulong sa kanilang pag-unlad.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-[17px] mb-[-16px]">
            <PersonStandingIcon className="h-6 w-6 text-tiwala-red" />
            Mga Miyembro ng Pamayanan
          </CardTitle>
          <h2 className="text-[18px] font-semibold"></h2>
          
          {referrals.map((referral) => (
            <Card key={referral.id} className="shadow-card border-0 ml-[-5px]">
              <CardContent className="px-6 py-5">
                <div className="flex items-start justify-between">
                  {/* Member Info */}
                  <div className="flex items-start space-x-2">
                    <div className="text-4xl">{referral.profileImage}</div>
                    
                      <div className="space-y-1">
                       <div>
                         <h3 className="font-semibold text-[16px]">{referral.name}</h3>
                         <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                           <span>{referral.relationship}</span>
                           <span>•</span>
                           <Calendar className="h-3 w-3" />
                           <span>
                             {new Date(referral.dateReferred).toLocaleDateString('tl-PH')}
                           </span>
                         </div>
                         <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                           <Phone className="h-3 w-3" />
                           <span>{referral.phoneNumber}</span>
                         </div>
                       </div>
                       
                       {/* Tiwala Index */}
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-xl font-bold text-tiwala-red">
                              {referral.tiwalaIndex}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Tiwala Index
                            </div>
                          </div>
                          
                           <Badge className={`${getStatusColor(referral.status)} text-center flex items-center justify-center`}>
                             {getStatusText(referral.status)}
                           </Badge>
                        </div>
                        
                        {/* Action Button */}
                        {referral.status === 'needs_support' && (
                          <div className="pt-1">
                            <Button
                              onClick={() => handleSendSupport(referral.id)}
                              variant="harvest"
                              className='h-[30px] w-[120px] text-[13px]'
                            >
                              <Heart className="h-3 w-3 mr-2" />
                              Tumulong
                            </Button>
                          </div>
                        )}
                      </div>
                   </div>
                   
                   {/* Status Indicators */}
                   <div className="text-center">
                     {referral.status === 'active' && (
                       <div className="flex flex-col items-center space-y-1 ml-3">
                         <TrendingUp className="h-5 w-5 text-accent" />
                         <span className="text-xs text-accent font-medium">
                           Maayos
                         </span>
                       </div>
                     )}
                     
                     {referral.status === 'defaulted' && (
                       <div className="flex flex-col items-center space-y-1">
                         <AlertTriangle className="h-5 w-5 text-destructive" />
                         <span className="text-xs text-destructive font-medium">
                           May Problema
                         </span>
                       </div>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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