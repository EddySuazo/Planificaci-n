import React from 'react';
import { UnifiedAuthView } from './UnifiedAuthView';
import { UserProfile } from '../types';

interface LoginViewProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchToRegister?: () => void;
  onQuickLogin?: (cedula: string) => void;
  initialIdentifier?: string;
  successMessage?: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  initialIdentifier = '',
  successMessage = null
}) => {
  return (
    <UnifiedAuthView
      onSuccess={onSuccess}
      initialMode="login"
      initialIdentifier={initialIdentifier}
      initialMessage={successMessage}
    />
  );
};
