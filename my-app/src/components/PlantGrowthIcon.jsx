// Plant Growth Icon Component representing Tiwala Index levels
import React from 'react';
import seedlingIcon from '@/assets/plant-seedling.png';
import buddingIcon from '@/assets/plant-budding.png';
import matureIcon from '@/assets/plant-mature.png';
import treeIcon from '@/assets/plant-tree.png';


// Removed TypeScript interfaces and types

const getPlantData = (index) => {
  if (index < 500) return { stage: 'seedling', icon: seedlingIcon, label: 'Binhi' };
  if (index < 700) return { stage: 'budding', icon: buddingIcon, label: 'Supang' };
  if (index < 850) return { stage: 'mature', icon: matureIcon, label: 'Matatag' };
  return { stage: 'tree', icon: treeIcon, label: 'Katiwala' };
};

export function PlantGrowthIcon({ tiwalaIndex, size = 'md', animated = false }) {
  const plant = getPlantData(tiwalaIndex);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  return (
    <div className={`
      flex items-center justify-center
      ${animated ? 'transition-all duration-500 hover:scale-110' : ''}
    `}>
      <img 
        src={plant.icon}
        alt={`${plant.label} - ${tiwalaIndex} points`}
        className={`
          ${sizeClasses[size]} 
          object-contain
          ${animated ? 'animate-pulse' : ''}
        `}
        title={`${plant.label} - ${tiwalaIndex} points`}
      />
    </div>
  );
}

// Helper function to determine plant stage based on Tiwala Index
export function getPlantStage(tiwalaIndex) {
  if (tiwalaIndex >= 850) return 'tree';
  if (tiwalaIndex >= 700) return 'mature';
  if (tiwalaIndex >= 500) return 'budding';
  return 'seedling';
}

// Helper function to get stage name in Tagalog  
export function getPlantStageName(stage) {
  switch (stage) {
    case 'seedling': return 'Binhi';
    case 'budding': return 'Supang';
    case 'mature': return 'Matatag';
    case 'tree': return 'Katiwala';
    default: return 'Binhi';
  }
}