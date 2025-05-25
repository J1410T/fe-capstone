import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '../utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'secondary',
  className = ''
}) => {
  const colorClass = getStatusColor(status);
  
  return (
    <Badge 
      variant={variant}
      className={`${colorClass} ${className}`}
    >
      {status}
    </Badge>
  );
};
