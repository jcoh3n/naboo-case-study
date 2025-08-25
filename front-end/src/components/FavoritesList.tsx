import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Card, Text, Group, Stack, Alert, LoadingOverlay, Box, Badge } from '@mantine/core';
import { IconAlertCircle, IconHeart, IconMapPin, IconCurrencyEuro } from '@tabler/icons-react';
import { reorderFavoritesMutation } from '../graphql/favorites';
import { useFavoritesCache } from './FavoritesCacheProvider';
import { useSnackbar } from '../hooks/useSnackbar';

export const FavoritesList: React.FC = () => {
  const { success, error: showError } = useSnackbar();
  const [reordering, setReordering] = useState(false);
  const { favorites, isLoading, refetch } = useFavoritesCache();

  const [reorderFavorites] = useMutation(reorderFavoritesMutation, {
    onCompleted: () => {
      success('Favoris réorganisés avec succès');
      refetch();
    },
    onError: (error) => {
      showError(`Erreur: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <Card withBorder p="xl" radius="lg" shadow="sm">
        <LoadingOverlay visible />
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card withBorder p="xl" radius="lg" shadow="sm" ta="center">
        <Stack align="center" spacing="lg">
          <IconHeart size={48} color="gray" />
          <Text size="lg" weight={600} c="dimmed">
            Aucun favori pour le moment
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Ajoutez des activités à vos favoris pour les retrouver ici
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder p="xl" radius="lg" shadow="sm">
      {/* En-tête simple */}
      <Group position="apart" mb="lg" align="center">
        <Text size="xl" weight={700}>
          Mes Favoris
        </Text>
        <Badge 
          leftSection={<IconHeart size={14} />}
          variant="light" 
          color="red" 
          size="md"
        >
          {favorites.length}
        </Badge>
      </Group>

      {/* Liste des favoris simplifiée */}
      <Stack spacing="md">
        {favorites.map((activity: any) => (
          <Card 
            key={activity.id} 
            withBorder 
            p="md" 
            radius="md" 
            shadow="xs"
            sx={{
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Group position="apart" align="flex-start">
              <Box sx={{ flex: 1 }}>
                <Text weight={600} size="md" mb="xs">
                  {activity.name}
                </Text>
                <Group spacing="xs" mb="xs">
                  <Badge 
                    leftSection={<IconMapPin size={12} />}
                    variant="light" 
                    color="pink" 
                    size="xs"
                  >
                    {activity.city}
                  </Badge>
                  <Badge 
                    leftSection={<IconCurrencyEuro size={12} />}
                    variant="light" 
                    color="yellow" 
                    size="xs"
                  >
                    {activity.price}€/j
                  </Badge>
                </Group>
                <Text size="sm" color="dimmed" lineClamp={2}>
                  {activity.description}
                </Text>
              </Box>
              
              <IconHeart size={20} color="red" />
            </Group>
          </Card>
        ))}
      </Stack>

      {reordering && <LoadingOverlay visible />}
    </Card>
  );
};
