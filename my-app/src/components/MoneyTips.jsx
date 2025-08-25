// Money tips and weather component
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tagalogStrings } from '@/data/tagalog-strings';
import { 
  BookOpen, 
  Cloud, 
  Sun, 
  Droplets,
  PiggyBank,
  Calculator,
  TrendingUp,
  Lightbulb,
  TreePalm
} from 'lucide-react';
import farmerImage from '@/assets/farmer-smartphone.jpg';

// Demo weather and tip data
const demoWeatherData = {
  location: "Batangas",
  temperature: "32°C",
  condition: "Mainit at Tuyo",
  forecast: "Walang ulan sa susunod na 5 araw",
  recommendation: "Maganda para sa pag-aani ng palay"
};

const moneyTipsData = [
  {
    id: 1,
    category: "Pag-iimpok",
    title: "50-30-20 na Pamamaraan",
    description: "50% sa mga pangangailangan, 30% sa mga gusto, 20% sa pag-iimpok",
    icon: PiggyBank,
    color: "text-accent"
  },
  {
    id: 2,
    category: "Budget",
    title: "Magkalkahin ang mga Gastusin",
    description: "I-record lahat ng gastos para makita kung saan napupunta ang pera",
    icon: Calculator,
    color: "text-tiwala-gold"
  },
  {
    id: 3,
    category: "Pamumuhunan",
    title: "Simulan nang Maliit",
    description: "Hindi kailangan malaki ang puhunan. Magsimula sa maliit at palawakin unti-unti",
    icon: TrendingUp,
    color: "text-tiwala-red"
  },
  {
    id: 4,
    category: "Emergency Fund",
    title: "3-6 Buwan na Gastos",
    description: "Mag-ipon ng pera na sapat para sa 3-6 buwan na gastos sa bahay",
    icon: Lightbulb,
    color: "text-primary"
  }
];

const farmingTips = [
  {
    id: 1,
    title: "Tamang Panahon ng Pagtatanim",
    description: "Magtanim ng palay tuwing tag-ulan para sa mas mataas na ani",
    weather: "Tag-ulan"
  },
  {
    id: 2,
    title: "Pag-aani sa Tamang Oras",
    description: "Anihin ang palay kapag tuyo na ang panahon para hindi mabulok",
    weather: "Tag-araw"
  },
  {
    id: 3,
    title: "Pag-iingat sa Peste",
    description: "Gumamit ng natural na pestisidyo tulad ng neem oil",
    weather: "Lahat ng panahon"
  }
];

export function MoneyTips() {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="relative h-48 overflow-hidden rounded-lg">
        <img 
          src={farmerImage} 
          alt="Farmer with Smartphone"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tiwala-red/90 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
          <BookOpen className="h-8 w-8 mb-2" />
          <h1 className="text-2xl font-bold">
            {tagalogStrings.moneyTips.title}
          </h1>
          <p className="text-white/90 text-sm mt-2">
            {tagalogStrings.moneyTips.subtitle}
          </p>
        </div>
      </div>
      
      {/* Weather Section */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[19px]">
            <Sun className="h-5 w-5 mr-4 text-tiwala-gold" />
            {tagalogStrings.moneyTips.weatherTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Current Weather */}
          <div className="bg-gradient-harvest p-4 rounded-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{demoWeatherData.location}</h3>
                <p className="text-white/90">{demoWeatherData.condition}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{demoWeatherData.temperature}</div>
                <div className="text-sm text-white/90">{demoWeatherData.forecast}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12px] bg-white/20 p-2 rounded">
              <Lightbulb className="h-4 w-4" />
              <span>{demoWeatherData.recommendation}</span>
            </div>
          </div>
          
          {/* Farming Tips */}
          <div className="space-y-2">

          <CardTitle className="flex items-center gap-2 text-[17px]">
            <TreePalm className="h-5 w-5 text-tiwala-red" />
            <h4 className="font-semibold text-[17px]">Mga Tip sa Pagsasaka</h4>
          </CardTitle>
            {farmingTips.map((tip) => (
              <div key={tip.id} className="bg-surface p-4 rounded-lg hover:shadow-card transition-shadow">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] text-tiwala-gold font-semibold font-poppins mr-4">{tip.id}</span>
                  <h5 className="font-semibold text-[15px]">{tip.title}</h5>
                </div>
                <p className="text-[12px] text-muted-foreground mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Money Management Tips */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[17px] mb-[-16px]">
            <PiggyBank className="h-6 w-6 text-tiwala-red" />
            {tagalogStrings.moneyTips.savingTips}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {moneyTipsData.map((tip) => (
            <div key={tip.id} className="bg-surface p-4 rounded-lg hover:shadow-card transition-shadow">
              <div className="flex items-center gap-2">
                <span className="text-[16px] text-tiwala-gold font-semibold font-poppins mr-4">{tip.id}</span>
                <h5 className="font-semibold text-[15px]">{tip.title}</h5>
              </div>
              <p className="text-[12px] text-muted-foreground mt-1">{tip.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Budget Planning Card */}
      <Card className="shadow-card border-0 bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[17px]">
            <Calculator className="h-5 w-5 text-tiwala-gold" />
            Gabay sa Pag-budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-accent/10 rounded-lg">
              <div className="text-lg font-bold text-accent">60%</div>
              <div className="text-sm text-muted-foreground">Prioridad</div>
              <div className="text-xs text-muted-foreground mt-1">Pagkain, Kuryente, Tubig</div>
            </div>
            
            <div className="text-center p-3 bg-tiwala-gold/10 rounded-lg">
              <div className="text-lg font-bold text-tiwala-gold">20%</div>
              <div className="text-sm text-muted-foreground">Mga Gusto</div>
              <div className="text-xs text-muted-foreground mt-1">Libangan, Shopping</div>
            </div>
            
            <div className="text-center p-3 bg-tiwala-red/10 rounded-lg">
              <div className="text-lg font-bold text-tiwala-red">20%</div>
              <div className="text-sm text-muted-foreground">Pag-iimpok</div>
              <div className="text-[10px] text-muted-foreground mt-1">Emergency, Investment</div>
            </div>
          </div>
          
          <div className="bg-surface p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Lightbulb className="h-4 w-4 text-tiwala-gold" />
              <span className="font-medium">Tip:</span>
            </div>
            <div className='ml-6'>
              <span className="text-muted-foreground text-[14px]">
                Simulan sa maliit. Kung hindi mo ma-achieve ang 20% sa pag-iimpok, magsimula sa 5% o 10%.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}