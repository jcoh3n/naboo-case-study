import React from 'react';
import { useMutation } from '@apollo/client';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { addToFavoritesMutation, removeFromFavoritesMutation } from '../graphql/favorites';
import { useFavoriteState } from '../hooks/useFavoriteState';
import { useSnackbar } from '../hooks/useSnackbar';

/**
 * Props du composant FavoriteButton
 */
interface FavoriteButtonProps {
  /** ID de l'activité à marquer comme favorite */
  activityId: string;
  /** Taille du bouton (défaut: 'md') */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Callback appelé lors du changement de statut favori */
  onFavoriteChange?: (isFavorite: boolean) => void;
}

/**
 * Composant bouton cœur pour gérer les favoris
 * 
 * Fonctionnalités :
 * - Toggle favori avec feedback visuel instantané
 * - États de chargement avec spinner
 * - Animations hover et transitions fluides
 * - Notifications success/error automatiques
 * - Synchronisation avec le cache global
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  activityId,
  size = 'md',
  onFavoriteChange,
}) => {
  const { success, error: showError } = useSnackbar();
  const { isFavorite, isLoading: favoriteLoading, refetch } = useFavoriteState(activityId);

  // Mutation pour ajouter aux favoris avec gestion des callbacks
  const [addToFavorites, { loading: addingLoading }] = useMutation(addToFavoritesMutation, {
    onCompleted: () => {
      success('Activité ajoutée aux favoris');
      refetch(); // Re-synchroniser le cache
      onFavoriteChange?.(true); // Notifier le parent si callback fourni
    },
    onError: (error) => {
      showError(`Erreur: ${error.message}`);
    },
  });

  // Mutation pour retirer des favoris avec gestion des callbacks
  const [removeFromFavorites, { loading: removingLoading }] = useMutation(removeFromFavoritesMutation, {
    onCompleted: () => {
      success('Activité retirée des favoris');
      refetch(); // Re-synchroniser le cache
      onFavoriteChange?.(false); // Notifier le parent si callback fourni
    },
    onError: (error) => {
      showError(`Erreur: ${error.message}`);
    },
  });

  /**
   * Gestionnaire du toggle favori
   * Détermine l'action à effectuer selon l'état actuel
   */
  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeFromFavorites({ variables: { activityId } });
    } else {
      await addToFavorites({ variables: { activityId } });
    }
  };

  // État de chargement global (toute opération en cours)
  const isLoading = favoriteLoading || addingLoading || removingLoading;

  return (
    <Tooltip
      label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      position="top"
      withArrow
      openDelay={500}
    >
      <ActionIcon
        size={size}
        variant="subtle"
        color={isFavorite ? 'red' : 'gray'}
        loading={isLoading}
        onClick={handleToggleFavorite}
        sx={{
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: isFavorite ? 'rgba(220, 38, 38, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          },
        }}
      >
        {isFavorite ? (
          <IconHeartFilled size={16} fill="currentColor" />
        ) : (
          <IconHeart size={16} />
        )}
      </ActionIcon>
    </Tooltip>
  );
};
