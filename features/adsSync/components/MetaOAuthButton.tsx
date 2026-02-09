import React, { useState } from 'react';
import { useMetaAccount } from '../../../contexts/MetaAccountContext';
import Button from '../../../components/shared/ui/Button';
import { Link } from 'lucide-react';

interface MetaOAuthButtonProps {
  onConnectSuccess?: () => void;
  onConnectError?: (error: string) => void;
}

const MetaOAuthButton: React.FC<MetaOAuthButtonProps> = ({ onConnectSuccess, onConnectError }) => {
  const { connectAccount } = useMetaAccount();
  const [isConnecting, setIsConnecting] = useState(false);

  // Simulate Meta OAuth flow
  const handleMetaOAuth = async () => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would redirect to Meta's OAuth endpoint:
      // https://www.facebook.com/v20.0/dialog/oauth?
      //   client_id=YOUR_APP_ID
      //   &redirect_uri=YOUR_REDIRECT_URI
      //   &state=YOUR_STATE
      //   &scope=ads_read,ads_management,business_management,leads_retrieval,pages_read_engagement,pages_show_list
      
      // Simulate OAuth flow delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful OAuth response
      const email = 'user@example.com';
      const name = 'Meta User';
      const accessToken = `EAAG${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      // Connect the account
      connectAccount(email, name, accessToken);
      
      if (onConnectSuccess) {
        onConnectSuccess();
      }
    } catch (error) {
      const errorMessage = 'Failed to connect to Meta account';
      console.error(errorMessage, error);
      
      if (onConnectError) {
        onConnectError(errorMessage);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleMetaOAuth}
      variant="primary"
      size="md"
      icon={Link}
      iconPosition="left"
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect to Meta Account'}
    </Button>
  );
};

export default MetaOAuthButton;