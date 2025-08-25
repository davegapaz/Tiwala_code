// New user onboarding flow simulation
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Upload, 
  Camera, 
  Smartphone,
  User,
  MapPin,
  Calendar,
  ArrowRight,
  Shield
} from 'lucide-react';
import { tagalogStrings } from '@/data/tagalog-strings';
import heroImage from '@/assets/hero-rice-field.jpg';


// Removed TypeScript interfaces and types

export function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState('landing');
  const [formData, setFormData] = useState({
    referralCode: '',
    name: '',
    age: '',
    location: '',
    primaryCrop: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleNext = (nextStep) => {
    setCurrentStep(nextStep);
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setCurrentStep('completion');
  };
  
  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-subtle font-poppins">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Rice Fields"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tiwala-red/90 to-tiwala-red/30" />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Maligayang pagdating sa {tagalogStrings.appName}!
          </h1>
          <p className="text-white/90 text-sm">
            {tagalogStrings.tagline}
          </p>
        </div>
      </div>
      
      <div className="px-4 py-8 max-w-md mx-auto">
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Ano ang Tiwala?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-tiwala-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-tiwala-red" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Magkakasamang Pagtulong</h3>
                  <p className="text-xs text-foreground-muted mt-1">
                    Komunidad na nagtutulungan sa pangangailangan sa pera
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-tiwala-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-tiwala-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Build ng Tiwala</h3>
                  <p className="text-xs text-foreground-muted mt-1">
                    Magpatunay ng inyong kakayahan sa pamamagitan ng on-time payments
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-tiwala-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-tiwala-green" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Mag-refer ng Iba</h3>
                  <p className="text-xs text-foreground-muted mt-1">
                    Tulungang makasali ang mga kaibigan at kamag-anak
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={() => handleNext('referral-code')}
          className="w-full btn-modern bg-tiwala-red hover:bg-tiwala-red/90 text-white py-6 text-lg font-semibold"
        >
          Magsimula Ngayon
        </Button>
      </div>
    </div>
  );
  
  const renderReferralCode = () => (
    <div className="min-h-screen bg-gradient-subtle p-4 font-poppins">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-tiwala-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-8 w-8 text-tiwala-gold" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Referral Code
          </h1>
          <p className="text-foreground-muted text-sm">
            Pakilagay ang referral code na naipadala sa inyong SMS
          </p>
        </div>
        
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-6">
            <Label htmlFor="referralCode" className="text-sm font-medium">
              Referral Code
            </Label>
            <Input
              id="referralCode"
              placeholder="Halimbawa: MARIA2024"
              value={formData.referralCode}
              onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
              className="mt-2 text-center text-lg font-mono tracking-wider"
            />
            
            <div className="mt-4 p-3 bg-tiwala-green/5 rounded-lg border border-tiwala-green/20">
              <p className="text-xs text-tiwala-green text-center">
                💡 Hanapin ang code sa SMS na naipadala sa inyo
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={() => handleNext('id-verification')}
          disabled={!formData.referralCode}
          className="w-full btn-modern bg-tiwala-red hover:bg-tiwala-red/90 text-white py-4"
        >
          Magpatuloy
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
  
  const renderIdVerification = () => (
    <div className="min-h-screen bg-gradient-subtle p-4 font-poppins">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-tiwala-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-tiwala-red" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            ID Verification
          </h1>
          <p className="text-foreground-muted text-sm">
            Mag-upload ng inyong Valid ID para sa security
          </p>
        </div>
        
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-sm font-medium text-foreground mb-2">
                  Mag-upload ng Valid ID
                </p>
                <p className="text-xs text-foreground-muted mb-4">
                  National ID, Driver's License, o Passport
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    Kumuha ng Larawan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-700">
                  🔒 Ang inyong personal na impormasyon ay secure at hindi ibabahagi sa iba.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={() => handleNext('basic-info')}
          className="w-full btn-modern bg-tiwala-red hover:bg-tiwala-red/90 text-white py-4"
        >
          ID Na-upload Na (Demo)
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
  
  const renderBasicInfo = () => (
    <div className="min-h-screen bg-gradient-subtle p-4 font-poppins">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-tiwala-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-tiwala-green" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Basic Information
          </h1>
          <p className="text-foreground-muted text-sm">
            Kumpletuhin ang inyong profile
          </p>
        </div>
        
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Buong Pangalan *
              </Label>
              <Input
                id="name"
                placeholder="Juan Dela Cruz"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="age" className="text-sm font-medium">
                Edad *
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="35"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Lokasyon *
              </Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Piliin ang probinsya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nueva-ecija">Nueva Ecija</SelectItem>
                  <SelectItem value="batangas">Batangas</SelectItem>
                  <SelectItem value="laguna">Laguna</SelectItem>
                  <SelectItem value="bulacan">Bulacan</SelectItem>
                  <SelectItem value="pangasinan">Pangasinan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="primaryCrop" className="text-sm font-medium">
                Pangunahing Pananim *
              </Label>
              <Select value={formData.primaryCrop} onValueChange={(value) => setFormData({...formData, primaryCrop: value})}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Piliin ang crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="palay">Palay</SelectItem>
                  <SelectItem value="mais">Mais</SelectItem>
                  <SelectItem value="gulay">Gulay</SelectItem>
                  <SelectItem value="saging">Saging</SelectItem>
                  <SelectItem value="kamote">Kamote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={handleSubmit}
          disabled={!formData.name || !formData.age || !formData.location || !formData.primaryCrop || isSubmitting}
          className="w-full btn-modern bg-tiwala-red hover:bg-tiwala-red/90 text-white py-4"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Nagpo-process...
            </div>
          ) : (
            <>
              I-submit ang Application
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
  
  const renderCompletion = () => (
    <div className="min-h-screen bg-gradient-subtle p-4 font-poppins">
      <div className="max-w-md mx-auto pt-16">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-tiwala-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-tiwala-green" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Salamat, {formData.name.split(' ')[0]}!
          </h1>
          <p className="text-foreground-muted text-sm leading-relaxed">
            Ang inyong application ay nai-submit na at na-pre-approve salamat sa tiwala ni Maria.
          </p>
        </div>
        
        <Card className="shadow-card border-0 mb-6">
          <CardContent className="p-6 text-center">
            <Badge className="mb-4 bg-tiwala-green/10 text-tiwala-green border-tiwala-green/20">
              Pre-approved
            </Badge>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Status:</span>
                <span className="font-medium text-tiwala-green">Approved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Starter Tiwala Index:</span>
                <span className="font-medium">300 points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Antas:</span>
                <span className="font-medium">Baguhan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Referred by:</span>
                <span className="font-medium">Maria Santos</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-tiwala-gold/5 border border-tiwala-gold/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-tiwala-gold text-center">
            🎉 Magiging available ang inyong account sa loob ng 24 oras!
          </p>
        </div>
        
        <Button 
          onClick={onComplete}
          className="w-full btn-modern bg-tiwala-red hover:bg-tiwala-red/90 text-white py-6 text-lg font-semibold"
        >
          Bumalik sa Demo
        </Button>
      </div>
    </div>
  );
  
  switch (currentStep) {
    case 'landing':
      return renderLandingPage();
    case 'referral-code':
      return renderReferralCode();
    case 'id-verification':
      return renderIdVerification();
    case 'basic-info':
      return renderBasicInfo();
    case 'completion':
      return renderCompletion();
    default:
      return renderLandingPage();
  }
}