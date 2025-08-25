// Modal for adding new referrals
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTiwala } from '@/context/TiwalaContext';
import { tagalogStrings } from '@/data/tagalog-strings';
import { UserReferral } from '@/data/demo-users';
import { UserPlus, Sparkles } from 'lucide-react';
import { ref } from 'process';


// Removed TypeScript interfaces and types

export function ReferralModal({ open, onOpenChange }) {
  const { state, actions } = useTiwala();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    relationship: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = state.currentUser;
  if (!user) return null;
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canRefer || !formData.name.trim() || !formData.phoneNumber.trim() || !formData.relationship) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
  const newReferral = {
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      relationship: formData.relationship,
      tiwalaIndex: 300,
      antas: 'Baguhan',
      dateReferred: new Date().toISOString().split('T')[0],
      status: 'active',
      profileImage: '👤'
    };
    
    actions.addReferral(newReferral);
    
    // Reset form
    setFormData({ name: '', phoneNumber: '', relationship: '' });
    setIsSubmitting(false);
    onOpenChange(false);
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const referralsThisMonth = user.monthlyReferrals || 0;
  const canRefer = user.tiwalaIndex >= 700 && referralsThisMonth < 3;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-sm mx-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-tiwala-red" />
            {tagalogStrings.referral.title}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {tagalogStrings.referral.subtitle}
          </p>
        </DialogHeader>
        
        {!canRefer ? (
          <div className="space-y-3">
            <div className="bg-muted/50 border border-warning/20 rounded-lg p-3">
              <h3 className="font-medium text-warning mb-2 text-sm">
                {tagalogStrings.referral.requirementTitle}
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {user.tiwalaIndex < 700 && (
                  <li>• {tagalogStrings.referral.requirement700}</li>
                )}
                {referralsThisMonth >= 3 && (
                  <li>• Naabot na ang 3 referrals ngayong buwan</li>
                )}
                <li>• {tagalogStrings.referral.monthlyLimit}</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full"
              variant="outline"
            >
              {tagalogStrings.ui.back}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm">{tagalogStrings.referral.fullName}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Juan dela Cruz"
                required
                disabled={isSubmitting}
                className="h-9 text-sm"
              />
            </div>
            
            {/* Phone Number */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm">{tagalogStrings.referral.phoneNumber}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+63 917 123 4567"
                required
                disabled={isSubmitting}
                className="h-9 text-sm"
              />
            </div>
            
            {/* Relationship */}
            <div className="space-y-1">
              <Label className="text-sm">{tagalogStrings.referral.relationship}</Label>
              <Select 
                value={formData.relationship} 
                onValueChange={(value) => handleInputChange('relationship', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Piliin ang relasyon..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kapatid">{tagalogStrings.referral.relationships.kapatid}</SelectItem>
                  <SelectItem value="magulang">{tagalogStrings.referral.relationships.magulang}</SelectItem>
                  <SelectItem value="kaibigan">{tagalogStrings.referral.relationships.kaibigan}</SelectItem>
                  <SelectItem value="kapitbahay">{tagalogStrings.referral.relationships.kapitbahay}</SelectItem>
                  <SelectItem value="kamag_anak">{tagalogStrings.referral.relationships.kamag_anak}</SelectItem>
                  <SelectItem value="kasama_sa_trabaho">{tagalogStrings.referral.relationships.kasama_sa_trabaho}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="tiwala"
              className="w-full h-9 text-sm"
              disabled={isSubmitting || !formData.name.trim() || !formData.phoneNumber.trim() || !formData.relationship}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 animate-spin" />
                  {tagalogStrings.ui.loading}
                </div>
              ) : (
                tagalogStrings.referral.submit
              )}
            </Button>
            
            {/* Monthly Limit Info */}
            <div className="text-center text-xs text-muted-foreground">
              {user.monthlyReferrals}/3 referrals ngayong buwan
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}