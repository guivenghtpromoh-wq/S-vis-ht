'use client';

import React from 'react';
import {
  Zap,
  Wrench,
  Settings,
  Hammer,
  Building2,
  Paintbrush,
  Sparkles,
  Trees,
  Palette,
  Camera,
  Video,
  GraduationCap,
  Languages,
  Laptop,
  ShieldAlert,
  Wind,
  Utensils,
  Scissors,
  Truck,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  className = 'w-6 h-6 text-[#159447]',
  size = 24,
}) => {
  switch (iconName) {
    case 'Zap':
      return <Zap className={className} size={size} />;
    case 'Wrench':
      return <Wrench className={className} size={size} />;
    case 'Settings':
      return <Settings className={className} size={size} />;
    case 'Hammer':
      return <Hammer className={className} size={size} />;
    case 'Building2':
      return <Building2 className={className} size={size} />;
    case 'Paintbrush':
      return <Paintbrush className={className} size={size} />;
    case 'Sparkles':
      return <Sparkles className={className} size={size} />;
    case 'Trees':
      return <Trees className={className} size={size} />;
    case 'Palette':
      return <Palette className={className} size={size} />;
    case 'Camera':
      return <Camera className={className} size={size} />;
    case 'Video':
      return <Video className={className} size={size} />;
    case 'GraduationCap':
      return <GraduationCap className={className} size={size} />;
    case 'Languages':
      return <Languages className={className} size={size} />;
    case 'Laptop':
      return <Laptop className={className} size={size} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} size={size} />;
    case 'Wind':
      return <Wind className={className} size={size} />;
    case 'Utensils':
      return <Utensils className={className} size={size} />;
    case 'Scissors':
      return <Scissors className={className} size={size} />;
    case 'Truck':
      return <Truck className={className} size={size} />;
    case 'Layers':
      return <Layers className={className} size={size} />;
    default:
      return <HelpCircle className={className} size={size} />;
  }
};
