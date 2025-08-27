import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Card, Text, Group, Stack, LoadingOverlay, Box, Badge, Image, Button, SimpleGrid, Center, Divider } from '@mantine/core';
import { IconHeart, IconMapPin, IconCurrencyEuro, IconEye, IconHeartFilled } from '@tabler/icons-react';
import { reorderFavoritesMutation } from '../graphql/favorites';
import { useFavoritesCache } from './FavoritesCacheProvider';
import { useSnackbar } from '../hooks/useSnackbar';
import { FavoriteButton } from './FavoriteButton';
import Link from 'next/link';
import { useGlobalStyles } from '@/utils';

export const FavoritesList: React.FC = () => {
  const { success, error: showError } = useSnackbar();
  const [reordering, setReordering] = useState(false);
  const { favorites, isLoading, refetch } = useFavoritesCache();
  const { classes } = useGlobalStyles();

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
      <Box>
        {/* En-tête avec titre */}
        <Group position="apart" mb="xl" align="center">
          <Text size="xl" weight={700}>
            Mes Favoris
          </Text>
          <Text size="sm" color="dimmed">
            Aucun favori
          </Text>
        </Group>
        
        <Card withBorder p="xl" radius="lg" shadow="sm" ta="center">
          <Stack align="center" spacing="lg">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'rgba(248, 249, 250, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <IconHeart size={32} color="#adb5bd" />
            </Box>
            <Text size="lg" weight={600} c="dimmed">
              Aucun favori pour le moment
            </Text>
            <Text size="sm" c="dimmed" ta="center" maw={400}>
              Découvrez des activités passionnantes et ajoutez-les à vos favoris en cliquant sur le cœur
            </Text>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête avec titre */}
      <Group position="apart" mb="xl" align="center">
        <Text size="xl" weight={700}>
          Mes Favoris
        </Text>
        <Text size="sm" color="dimmed">
          {favorites.length} {favorites.length === 1 ? 'activité' : 'activités'}
        </Text>
      </Group>

      {/* Grille des favoris - style cohérent avec les autres activités */}
      <SimpleGrid 
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: 'md' },
          { maxWidth: 755, cols: 1, spacing: 'sm' },
        ]}
      >
        {favorites.map((activity: any) => (
          <Link href={`/activities/${activity.id}`} key={activity.id} className={classes.link}>
            <Card 
              shadow="sm" 
              padding="lg"
              radius="md" 
              withBorder
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative',
                border: '2px solid #ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.02)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(255, 107, 107, 0.2)',
                  border: '2px solid #ff5252',
                },
              }}
            >
            <Card.Section sx={{ position: 'relative' }}>
              <Image
                src="https://dummyimage.com/480x4:3"
                height={160}
                alt={`Image de ${activity.name}`}
              />
              {/* Indicateur visuel de favori */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  padding: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconHeartFilled size={18} color="#ff6b6b" />
              </Box>
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
              <Text weight={500} className={classes.ellipsis}>
                {activity.name}
              </Text>
            </Group>

            <Group mt="md" mb="xs">
              <Badge 
                leftSection={<IconMapPin size={12} />}
                color="pink" 
                variant="light"
                size="sm"
              >
                {activity.city}
              </Badge>
              <Badge 
                leftSection={<IconCurrencyEuro size={12} />}
                color="yellow" 
                variant="light"
                size="sm"
              >
                {activity.price}€/j
              </Badge>
            </Group>

            <Text size="sm" color="dimmed" className={classes.ellipsis} mb="md">
              {activity.description}
            </Text>

            {/* Bouton de retrait des favoris en position absolue */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 2,
              }}
              onClick={(e) => e.preventDefault()} // Empêche la navigation lors du clic sur le bouton
            >
              <FavoriteButton
                activityId={activity.id}
                size="sm"
              />
            </Box>
            </Card>
          </Link>
        ))}
      </SimpleGrid>

      {reordering && <LoadingOverlay visible />}
    </Box>
  );
};
