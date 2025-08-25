// Enhanced Money Tips with Action Plans and Weather-based Tips
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { tagalogStrings } from '@/data/tagalog-strings';
import { 
  BookOpen, 
  Cloud, 
  Sun, 
  CloudRain,
  Wind,
  Droplets,
  PiggyBank,
  Calculator,
  TrendingUp,
  Lightbulb,
  TreePine,
  CheckCircle,
  Calendar,
  MapPin
} from 'lucide-react';
import farmerImage from '@/assets/farmer-smartphone.jpg';
// Removed TypeScript interfaces

// Weather condition objects
const weatherConditions = [
  {
    id: 'sunny',
    name: 'Tag-araw',
    condition: 'Mainit at Tuyo',
    temperature: '32°C',
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    forecast: 'Walang ulan sa susunod na 5 araw',
    recommendation: 'Maganda para sa pag-aani ng mga tuyo na pananim'
  },
  {
    id: 'rainy',
    name: 'Tag-ulan',
    condition: 'Maulap at May Ulan',
    temperature: '26°C',
    icon: <CloudRain className="h-6 w-6 text-blue-500" />,
    forecast: 'Uulan sa susunod na 3 araw',
    recommendation: 'Magtanim ng palay at mga water-loving crops'
  },
  {
    id: 'typhoon',
    name: 'Bagyo',
    condition: 'Malakas na Hangin',
    temperature: '24°C',
    icon: <Wind className="h-6 w-6 text-red-500" />,
    forecast: 'Malakas na bagyo sa susunod na 2 araw',
    recommendation: 'Mag-prepare ng emergency supplies at protektahan ang mga pananim'
  },
  {
    id: 'cool',
    name: 'Malamig',
    condition: 'Maambon at Malamig',
    temperature: '18°C',
    icon: <Cloud className="h-6 w-6 text-gray-500" />,
    forecast: 'Malamig na panahon sa susunod na linggo',
    recommendation: 'Magtanim ng mga gulay na umuunlad sa malamig'
  }
];

// Weather tips object
const weatherTips = {
  sunny: [
    {
      id: 'drought-management',
      category: 'Pamamahala sa Tagtuyot',
      title: 'Water Conservation Strategy',
      description: 'Mga hakbang para makatipid ng tubig sa panahon ng tag-araw',
      actionItems: [
        { id: '1', text: 'Gamitin ang drip irrigation o mag-dilig nang maaga sa umaga', completed: false },
        { id: '2', text: 'Takpan ang lupa ng mulch (dayami o damo) upang mapanatili ang moisture', completed: false },
        { id: '3', text: 'Bigyang-priority ang pagdidilig sa mga batang pananim', completed: false },
        { id: '4', text: 'I-consider ang pagtatanim ng drought-resistant na gulay tulad ng okra', completed: false }
      ],
      crop: 'all'
    },
    {
      id: 'harvest-timing',
      category: 'Tamang Pag-aani',
      title: 'Optimal Harvest Schedule',
      description: 'Gamitin ang mainit na panahon para sa tamang pag-aani',
      actionItems: [
        { id: '1', text: 'Anihin ang mga hinog na prutas bago mag-peak ang init', completed: false },
        { id: '2', text: 'Mag-harvest ng mga leafy greens sa madaling araw', completed: false },
        { id: '3', text: 'I-dry ang mga harvest sa natural na paraan gamit ang araw', completed: false }
      ],
      crop: 'all'
    }
  ],
  rainy: [
    {
      id: 'flood-management',
      category: 'Pamamahala sa Baha',
      title: 'Flood Prevention & Management',
      description: 'Protektahan ang inyong pananim sa malakas na ulan',
      actionItems: [
        { id: '1', text: 'Itaas ang mga garden beds o gumamit ng mga sacks', completed: false },
        { id: '2', text: 'Siguraduhing malinis ang mga drainage canal sa bukid', completed: false },
        { id: '3', text: 'Magtanim ng palay na variety na lumalaban sa baha (NSIC Rc222)', completed: false },
        { id: '4', text: 'Mag-apply ng organic fungicide para sa prevention ng sakit', completed: false }
      ],
      crop: 'palay'
    },
    {
      id: 'soil-preparation',
      category: 'Paghahanda ng Lupa',
      title: 'Soil Management sa Tag-ulan',
      description: 'Panatilihin ang kalusugan ng lupa sa matagal na ulan',
      actionItems: [
        { id: '1', text: 'Mag-add ng organic matter para sa better drainage', completed: false },
        { id: '2', text: 'I-test ang pH ng lupa after heavy rains', completed: false },
        { id: '3', text: 'Mag-plant ng cover crops para sa soil protection', completed: false }
      ],
      crop: 'all'
    }
  ],
  typhoon: [
    {
      id: 'emergency-prep',
      category: 'Emergency Preparation',
      title: 'Pre-Typhoon Action Plan',
      description: 'Mga hakbang bago dumating ang bagyo',
      actionItems: [
        { id: '1', text: 'Mag-harvest ng lahat ng nahinog na pananim ngayon na', completed: false },
        { id: '2', text: 'Itali ang mga mataas na halaman sa maliliit na poste', completed: false },
        { id: '3', text: 'Mag-imbak ng mga buto at pataba sa mataas at tuyong lugar', completed: false },
        { id: '4', text: 'Palakasin ang mga canal at dike para sa flood protection', completed: false }
      ],
      crop: 'all'
    },
    {
      id: 'financial-prep',
      category: 'Financial Preparedness',
      title: 'Pag-prepare ng Emergency Fund',
      description: 'Financial steps para sa post-typhoon recovery',
      actionItems: [
        { id: '1', text: 'Maglaan ng pondo para sa emergency repairs', completed: false },
        { id: '2', text: 'I-secure ang mga importante ng dokumento', completed: false },
        { id: '3', text: 'Kumonsulta sa crop insurance programs', completed: false }
      ],
      crop: 'all'
    }
  ],
  cool: [
    {
      id: 'cold-weather-crops',
      category: 'Cold-Weather Farming',
      title: 'Malamig na Panahon Strategy',
      description: 'Gamitin ang malamig na klima para sa specialty crops',
      actionItems: [
        { id: '1', text: 'Magtanim ng leafy greens (lettuce, cabbage, carrots)', completed: false },
        { id: '2', text: 'Mag-setup ng greenhouse o protective covers', completed: false },
        { id: '3', text: 'Monitor ang mga pananim para sa powdery mildew', completed: false }
      ],
      crop: 'gulay'
    }
  ]
};

export function EnhancedMoneyTips() {
  const [selectedWeather, setSelectedWeather] = useState<string>('sunny');
  const [completedActions, setCompletedActions] = useState({});
  
  const currentWeather = weatherConditions.find(w => w.id === selectedWeather);
  const currentTips = weatherTips[selectedWeather] || [];
  
  const toggleAction = (actionId) => {
    setCompletedActions(prev => ({
      ...prev,
      [actionId]: !prev[actionId]
    }));
  };
  
  const getCompletedCount = (tip) => {
    return tip.actionItems.filter(item => completedActions[`${tip.id}-${item.id}`]).length;
  };
  
  return (
    <div className="space-y-6 font-poppins">
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
            Payo at Aksyon
          </h1>
          <p className="text-white/90 text-sm mt-2">
            Action plans para sa matagumpay na pag-sasaka
          </p>
        </div>
      </div>
      
      {/* Weather Selection */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-tiwala-gold" />
            Piliin ang Kondisyon ng Panahon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {weatherConditions.map((weather) => (
              <button
                key={weather.id}
                onClick={() => setSelectedWeather(weather.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedWeather === weather.id
                    ? 'border-tiwala-red bg-tiwala-red/5'
                    : 'border-border hover:border-tiwala-red/50'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  {weather.icon}
                  <div className="text-sm font-medium mt-2">{weather.name}</div>
                  <div className="text-xs text-foreground-muted">{weather.temperature}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Current Weather Card */}
      <Card className="shadow-card border-0">
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-tiwala-red to-tiwala-gold p-4 rounded-lg text-white mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Batangas
                </h3>
                <p className="text-white/90">{currentWeather.condition}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentWeather.temperature}</div>
                <div className="text-sm text-white/90">{currentWeather.forecast}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm bg-white/20 p-2 rounded">
              <Lightbulb className="h-4 w-4" />
              <span>{currentWeather.recommendation}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Plans */}
      {currentTips.map((tip) => (
        <Card key={tip.id} className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TreePine className="h-5 w-5 text-tiwala-green" />
                {tip.title}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {getCompletedCount(tip)}/{tip.actionItems.length} tapos
              </Badge>
            </div>
            <p className="text-sm text-foreground-muted">{tip.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tip.actionItems.map((action) => (
                <div
                  key={action.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    completedActions[`${tip.id}-${action.id}`]
                      ? 'bg-tiwala-green/5 border border-tiwala-green/20'
                      : 'bg-surface hover:bg-surface-hover'
                  }`}
                >
                  <Checkbox
                    id={`${tip.id}-${action.id}`}
                    checked={completedActions[`${tip.id}-${action.id}`] || false}
                    onCheckedChange={() => toggleAction(`${tip.id}-${action.id}`)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={`${tip.id}-${action.id}`}
                    className={`text-sm flex-1 cursor-pointer ${
                      completedActions[`${tip.id}-${action.id}`]
                        ? 'text-tiwala-green font-medium'
                        : 'text-foreground'
                    }`}
                  >
                    {action.text}
                    {completedActions[`${tip.id}-${action.id}`] && (
                      <CheckCircle className="h-4 w-4 text-tiwala-green inline ml-2" />
                    )}
                  </label>
                </div>
              ))}
            </div>
            
            {getCompletedCount(tip) === tip.actionItems.length && (
              <div className="mt-4 p-3 bg-tiwala-green/5 border border-tiwala-green/20 rounded-lg">
                <div className="flex items-center gap-2 text-tiwala-green">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Excellent! Nakumpleto ninyo ang lahat ng action items.
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {/* Budget Planning Card */}
      <Card className="shadow-card border-0 bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-tiwala-gold" />
            Smart Budget para sa Farmers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-xl font-bold text-accent">50%</div>
              <div className="text-sm text-muted-foreground">Farm Operations</div>
              <div className="text-xs text-muted-foreground mt-1">Buto, Pataba, Labor</div>
            </div>
            
            <div className="text-center p-4 bg-tiwala-gold/10 rounded-lg">
              <div className="text-xl font-bold text-tiwala-gold">30%</div>
              <div className="text-sm text-muted-foreground">Family Needs</div>
              <div className="text-xs text-muted-foreground mt-1">Pagkain, Education</div>
            </div>
            
            <div className="text-center p-4 bg-tiwala-red/10 rounded-lg">
              <div className="text-xl font-bold text-tiwala-red">20%</div>
              <div className="text-sm text-muted-foreground">Savings & Emergency</div>
              <div className="text-xs text-muted-foreground mt-1">Future Investment</div>
            </div>
          </div>
          
          <div className="bg-surface p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <PiggyBank className="h-4 w-4 text-tiwala-gold" />
              <span className="font-medium">Pro Tip:</span>
            </div>
            <div className='ml-6'>
              <span className="text-muted-foreground text-sm">
                Diversify your income streams. Mag-try ng value-added products tulad ng dried fruits o processed vegetables.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}