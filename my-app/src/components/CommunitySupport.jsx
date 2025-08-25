// Community Support page for helping struggling members
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTiwala } from '@/context/TiwalaContext';
import { PlantGrowthIcon } from './PlantGrowthIcon';
import { tagalogStrings } from '@/data/tagalog-strings';
import { 
  ArrowLeft, 
  Heart, 
  Coins, 
  Users, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CommunitySupport({ strugglingUserId = 'carlos', onBack }) {
  const { state, actions } = useTiwala();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [useSuggested, setUseSuggested] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const strugglingUser = state.users.find(u => u.id === strugglingUserId);
  const currentUser = state.currentUser;
  
  if (!strugglingUser || !currentUser) return null;
  
  const shortfall = 850; // Demo shortfall amount
  const communitySize = 5; // Demo community size
  const suggestedAmount = Math.floor(shortfall / communitySize); // Pre-calculated suggested amount
  
  React.useEffect(() => {
    setSelectedAmount(suggestedAmount);
  }, [suggestedAmount]);
  
  const handleSuggestedAmountClick = () => {
    setUseSuggested(true);
    setSelectedAmount(suggestedAmount);
    setCustomAmount('');
  };
  
  const handleCustomAmountChange = (value) => {
    setUseSuggested(false);
    setCustomAmount(value);
    const amount = parseInt(value) || 0;
    setSelectedAmount(amount);
  };
  
  const handleConfirmSupport = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccessModal(true);
    
    // Update context
    actions.updateTiwalaIndex(5, "Tumulong sa pamayanan");
  };
  
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onBack();
  };
  
  return (
    <div className="min-h-screen bg-gradient-subtle p-4 font-poppins">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6 pt-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Tulong sa Pamayanan
            </h1>
            <p className="text-sm text-foreground-muted mt-1">
              Tumulong kay {strugglingUser.name} na masalo ang kanyang bayarin sa linggong ito. 
              Ang tulong mo ay isang <span className="font-semibold">pautang</span> na kanyang isasauli sa iyo.
            </p>
          </div>
        </div>
        
        {/* Struggling User Info */}
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-tiwala-red/20 to-tiwala-red/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">{strugglingUser.profileImage}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{strugglingUser.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <PlantGrowthIcon 
                    tiwalaIndex={strugglingUser.tiwalaIndex} 
                    size="sm" 
                  />
                  <span className="text-sm text-foreground-muted">
                    {strugglingUser.antas} • {strugglingUser.tiwalaIndex}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                Nangangailangan
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Suggestion Card */}
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Iminumungkahi ang halaga:</h3>
              <div className="text-3xl font-bold text-tiwala-red mb-2">₱{suggestedAmount}</div>
              <p className="text-sm text-foreground-muted">
                Ito ay batay sa kabuuang kailangan at ang laki ng ating pamayanan.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Contribution Input Section */}
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Magkano ang nais mong ipahiram?
            </h3>
            
            <div className="space-y-4">
              {/* Suggested Amount Button */}
              <button
                onClick={handleSuggestedAmountClick}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  useSuggested
                    ? 'border-tiwala-red bg-tiwala-red/5'
                    : 'border-border hover:border-tiwala-red/50'
                }`}
              >
                <div className="text-lg font-bold text-foreground">₱{suggestedAmount}</div>
                <div className="text-xs text-foreground-muted">Iminumungkahi</div>
              </button>
              
              {/* Custom Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">O maglagay ng sariling halaga:</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground">₱</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="pl-8 text-lg"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Transparency Note */}
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-tiwala-gold mt-0.5 flex-shrink-0" />
              <div className="text-sm text-foreground-muted">
                <strong>Tandaan:</strong> Ang halagang ito ay idadagdag sa susunod na bayarin ni {strugglingUser.name} 
                bilang isang pautang na walang interes. Ang inyong Tiwala Index ay tataas kapag ito ay na-repay.
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Action Button */}
        <Button 
          onClick={handleConfirmSupport}
          disabled={isSubmitting || selectedAmount <= 0}
          className="w-full btn-modern bg-tiwala-red hover:bg-tiwala-red/90 text-white py-6 text-lg font-semibold"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Nagpapadala...
            </div>
          ) : (
            `I-confirm ang Tulong (₱${selectedAmount})`
          )}
        </Button>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-tiwala-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-tiwala-green" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Salamat sa inyong pagtulong!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-foreground-muted">
              Nakapag-ambag ka ng <strong>₱{selectedAmount}</strong> para kay {strugglingUser.name}. 
              Ang inyong kabaitan ay maaaring dagdag na puntos sa inyong Tiwala Index.
            </p>
            <Button 
              onClick={handleSuccessModalClose}
              className="w-full bg-tiwala-red hover:bg-tiwala-red/90 text-white"
            >
              Sige
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}