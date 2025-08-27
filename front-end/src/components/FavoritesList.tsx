import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Card, Text, Group, Stack, LoadingOverlay, Box, Image, SimpleGrid, Badge } from '@mantine/core';
import { IconHeart, IconMapPin, IconCurrencyEuro, IconHeartFilled, IconGripVertical } from '@tabler/icons-react';
import { reorderFavoritesMutation } from '../graphql/favorites';
import { useFavoritesCache } from './FavoritesCacheProvider';
import { FavoriteButton } from './FavoriteButton';
import Link from 'next/link';
import { useGlobalStyles } from '@/utils';
import {
  DndContext,
  closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Composant pour une carte de favori draggable
interface DraggableFavoriteCardProps {
  activity: any;
  classes: any;
  isRemoving?: boolean;
  onRemoveStart?: (id: string) => void;
}

const DraggableFavoriteCard: React.FC<DraggableFavoriteCardProps> = React.memo(({ 
  activity, 
  classes,
  isRemoving = false,
  onRemoveStart
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

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition || 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    opacity: isDragging ? 0.9 : isRemoving ? 0 : 1,
    zIndex: isDragging ? 1000 : 1,
    transitionProperty: 'opacity, transform',
    transitionDuration: isRemoving ? '0.3s' : '0.2s',
    pointerEvents: isRemoving ? 'none' : 'auto',
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragMode || isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Vérifier si l'élément cliqué est le bouton de favori ou un de ses enfants
    const favoriteButton = document.getElementById(`favorite-button-${activity.id}`);
    if (favoriteButton && favoriteButton.contains(e.target as Node)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Navigation normale
    window.location.href = `/activities/${activity.id}`;
  };

  const handleFavoriteChange = (isFavorite: boolean) => {
    if (!isFavorite) {
      // L'utilisateur retire des favoris
      onRemoveStart?.(activity.id);
    }
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
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isDragging ? 'grabbing' : 'pointer',
            position: 'relative',
            border: isDragging ? '2px solid #ff5252' : '2px solid #ff6b6b',
            backgroundColor: isDragging ? 'rgba(255, 107, 107, 0.08)' : 'rgba(255, 107, 107, 0.02)',
            boxShadow: isDragging ? '0 12px 35px rgba(255, 107, 107, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            transform: isDragging ? 'scale(1.02) rotate(2deg)' : 'scale(1)',
            '&:hover': !isDragging ? {
              transform: 'translateY(-4px) scale(1.01)',
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
                backgroundColor: isDragging ? 'rgba(255, 107, 107, 0.95)' : 'rgba(0, 0, 0, 0.75)',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'grab',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(8px)',
                boxShadow: isDragging ? '0 4px 12px rgba(255, 107, 107, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': !isDragging ? {
                  backgroundColor: 'rgba(255, 107, 107, 0.85)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.4)',
                } : {},
                '&:active': {
                  cursor: 'grabbing',
                  transform: isDragging ? 'scale(1.05)' : 'scale(0.95)',
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Empêche la propagation du clic vers la carte parente
            }}
          >
            <FavoriteButton
              activityId={activity.id}
              size="sm"
              onFavoriteChange={handleFavoriteChange}
              isRemoving={isRemoving}
            />
          </Box>
        </Card>
    </div>
  );
});

DraggableFavoriteCard.displayName = 'DraggableFavoriteCard';

export const FavoritesList: React.FC = () => {
  const { favorites, isLoading, refetch } = useFavoritesCache();
  const { classes } = useGlobalStyles();
  const [localFavorites, setLocalFavorites] = useState(favorites);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Mettre à jour l'état local quand les favoris changent (seulement si nécessaire)
  const lastFavoriteIds = React.useRef<string>('');
  
  React.useEffect(() => {
    const favoriteIds = favorites.map(f => f.id).join(',');
    
    if (favoriteIds !== lastFavoriteIds.current && favorites.length > 0) {
      console.log('Updating local favorites from server:', favoriteIds);
      setLocalFavorites(favorites);
      lastFavoriteIds.current = favoriteIds;
    }
    
    // Retirer les éléments marqués comme supprimés qui ne sont plus dans les favoris
    if (removingId && !favorites.some(f => f.id === removingId)) {
      setLocalFavorites(prev => prev.filter(fav => fav.id !== removingId));
      setRemovingId(null);
    }
  }, [favorites, removingId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum 8px de mouvement avant d'activer le drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [reorderFavorites] = useMutation(reorderFavoritesMutation, {
    onCompleted: () => {
      // Pas de notification - action silencieuse
    },
    onError: (error) => {
      // Restaurer l'ordre original en cas d'erreur (notification d'erreur gardée pour debug)
      console.error('Erreur réorganisation favoris:', error.message);
      setLocalFavorites(favorites);
    },
    // Optimiser le cache pour éviter les re-renders inutiles
    errorPolicy: 'all',
    fetchPolicy: 'no-cache', // Évite les conflits de cache pendant la mutation
  });

  const handleDragStart = () => {
    // Optionnel : logique globale au début du drag
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    console.log('Drag end:', { active: active?.id, over: over?.id });

    if (active.id !== over?.id && over) {
      const oldIndex = localFavorites.findIndex((item) => item.id === active.id);
      const newIndex = localFavorites.findIndex((item) => item.id === over.id);
      
      console.log('Indices:', { oldIndex, newIndex, totalItems: localFavorites.length });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(localFavorites, oldIndex, newIndex);
        console.log('New order:', newOrder.map(item => item.id));
        setLocalFavorites(newOrder);
        
        // Envoyer la nouvelle ordre au serveur en arrière-plan
        const activityIds = newOrder.map((activity) => activity.id);
        reorderFavorites({ variables: { activityIds } });
      }
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

  const sortableItems = localFavorites.map((activity) => activity.id);
  console.log('Sortable items:', sortableItems);

  return (
    <Box>
      {/* En-tête avec titre */}
      <Group position="apart" mb="xl" align="center">
        <Text size="xl" weight={700}>
          Mes Favoris
        </Text>
      </Group>

      {/* Contexte de drag & drop pour les favoris */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableItems}
          strategy={rectSortingStrategy}
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
                isRemoving={removingId === activity.id}
                onRemoveStart={(id) => setRemovingId(id)}
              />
            ))}
          </SimpleGrid>
        </SortableContext>
      </DndContext>
    </Box>
  );
};
