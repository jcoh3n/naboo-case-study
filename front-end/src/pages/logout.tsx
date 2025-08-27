import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { LoadingOverlay, Container, Text, Box } from '@mantine/core';

const Logout: React.FC = () => {
  const { handleLogout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await handleLogout();
      router.push('/signin');
    };
    
    performLogout();
  }, [handleLogout, router]);

  return (
    <Container size="sm">
      <Box ta="center" py="xl">
        <LoadingOverlay visible />
        <Text size="lg">Déconnexion en cours...</Text>
      </Box>
    </Container>
  );
};

export default Logout;
