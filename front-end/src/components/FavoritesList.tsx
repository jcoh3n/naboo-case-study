import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Card, Text, Group, Stack, LoadingOverlay, Box, Badge, Image, Button, SimpleGrid, Center, Divider } from '@mantine/core';
import { IconHeart, IconMapPin, IconCurrencyEuro, IconEye, IconHeartFilled, IconGripVertical, IconCheck } from '@tabler/icons-react';
import { reorderFavoritesMutation } from '../graphql/favorites';
import { useFavoritesCache } from './FavoritesCacheProvider';
import { useSnackbar } from '../hooks/useSnackbar';
import { FavoriteButton } from './FavoriteButton';
import Link from 'next/link';
import { useGlobalStyles } from '@/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Composant pour une carte de favori draggable
interface DraggableFavoriteCardProps {
  activity: any;
  classes: any;
}

const DraggableFavoriteCard: React.FC<DraggableFavoriteCardProps> = ({ 
  activity, 
  classes
}) => {
  const [isDragMode, setIsDragMode] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  // Gérer le mode drag avec les effets
  React.useEffect(() => {
    if (isDragging && !isDragMode) {
      setIsDragMode(true);
    } else if (!isDragging && isDragMode) {
      // Délai pour empêcher le clic après le drag
      setTimeout(() => {
        setIsDragMode(false);
      }, 150);
    }
  }, [isDragging, isDragMode]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragMode || isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Navigation normale
    window.location.href = `/activities/${activity.id}`;
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        onClick={handleCardClick}
        shadow="sm" 
        padding="lg"
        radius="md" 
        withBorder
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: isDragging ? 'none' : 'all 0.2s ease',
            cursor: isDragging ? 'grabbing' : 'pointer',
            position: 'relative',
            border: isDragging ? '2px solid #ff5252' : '2px solid #ff6b6b',
            backgroundColor: isDragging ? 'rgba(255, 107, 107, 0.08)' : 'rgba(255, 107, 107, 0.02)',
            boxShadow: isDragging ? '0 8px 25px rgba(255, 107, 107, 0.3)' : undefined,
            '&:hover': !isDragging ? {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 30px rgba(255, 107, 107, 0.2)',
              border: '2px solid #ff5252',
            } : {},
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
            
            {/* Handle de drag */}
            <Box
              {...attributes}
              {...listeners}
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: isDragging ? 'rgba(255, 107, 107, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                borderRadius: '6px',
                padding: '8px',
                cursor: 'grab',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 107, 0.8)',
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  cursor: 'grabbing',
                  transform: 'scale(0.95)',
                },
              }}
              onClick={(e) => e.preventDefault()} // Empêche la navigation
            >
              <IconGripVertical size={14} />
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
    </div>
  );
};

export const FavoritesList: React.FC = () => {
  const { success, error: showError } = useSnackbar();
  const { favorites, isLoading, refetch } = useFavoritesCache();
  const { classes } = useGlobalStyles();
  const [localFavorites, setLocalFavorites] = useState(favorites);
  const [isSaving, setIsSaving] = useState(false);

  // Mettre à jour l'état local quand les favoris changent
  React.useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [reorderFavorites] = useMutation(reorderFavoritesMutation, {
    onCompleted: () => {
      setIsSaving(false);
      success('Favoris réorganisés avec succès');
      refetch();
    },
    onError: (error) => {
      setIsSaving(false);
      showError(`Erreur: ${error.message}`);
      // Restaurer l'ordre original en cas d'erreur
      setLocalFavorites(favorites);
    },
  });

  const handleDragStart = () => {
    // Optionnel : logique globale au début du drag
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localFavorites.findIndex((item) => item.id === active.id);
      const newIndex = localFavorites.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(localFavorites, oldIndex, newIndex);
      setLocalFavorites(newOrder);
      
      // Envoyer la nouvelle ordre au serveur en arrière-plan
      setIsSaving(true);
      const activityIds = newOrder.map((activity) => activity.id);
      reorderFavorites({ variables: { activityIds } });
    }
  };

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
        <Group spacing="xs">
          <Text size="sm" color="dimmed">
            {localFavorites.length} {localFavorites.length === 1 ? 'activité' : 'activités'}
          </Text>
          {localFavorites.length > 1 && !isSaving && (
            <Badge variant="outline" color="gray" size="xs">
              Glisser pour réorganiser
            </Badge>
          )}
          {isSaving && (
            <Badge variant="light" color="blue" size="xs" leftSection={<IconCheck size={12} />}>
              Sauvegarde...
            </Badge>
          )}
        </Group>
      </Group>

      {/* Contexte de drag & drop pour les favoris */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localFavorites.map((activity) => activity.id)}
          strategy={verticalListSortingStrategy}
        >
          <SimpleGrid 
            cols={3}
            spacing="lg"
            breakpoints={[
              { maxWidth: 980, cols: 2, spacing: 'md' },
              { maxWidth: 755, cols: 1, spacing: 'sm' },
            ]}
          >
            {localFavorites.map((activity: any) => (
              <DraggableFavoriteCard
                key={activity.id}
                activity={activity}
                classes={classes}
              />
            ))}
          </SimpleGrid>
        </SortableContext>
      </DndContext>
    </Box>
  );
};
