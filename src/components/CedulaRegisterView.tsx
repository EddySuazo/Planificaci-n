import React from 'react';
import { UnifiedAuthView } from './UnifiedAuthView';
import { UserProfile } from '../types';

interface CedulaRegisterViewProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchToLogin?: (prefilledCedula?: string) => void;
  onQuickLogin?: (cedula: string) => void;
}

export const CedulaRegisterView: React.FC<CedulaRegisterViewProps> = ({
  onSuccess
}) => {
  return (
    <UnifiedAuthView
      onSuccess={onSuccess}
      initialMode="register"
    />
  );
};
