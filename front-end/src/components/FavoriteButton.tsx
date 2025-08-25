import React from 'react';
import { useMutation } from '@apollo/client';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { addToFavoritesMutation, removeFromFavoritesMutation } from '../graphql/favorites';
import { useFavoriteState } from '../hooks/useFavoriteState';
import { useSnackbar } from '../hooks/useSnackbar';

interface FavoriteButtonProps {
  activityId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  activityId,
  size = 'md',
  onFavoriteChange,
}) => {
  const { success, error: showError } = useSnackbar();
  const { isFavorite, isLoading: favoriteLoading, refetch } = useFavoriteState(activityId);

  const [addToFavorites, { loading: addingLoading }] = useMutation(addToFavoritesMutation, {
    onCompleted: () => {
      success('Activité ajoutée aux favoris');
      refetch();
      onFavoriteChange?.(true);
    },
    onError: (error) => {
      showError(`Erreur: ${error.message}`);
    },
  });

  const [removeFromFavorites, { loading: removingLoading }] = useMutation(removeFromFavoritesMutation, {
    onCompleted: () => {
      success('Activité retirée des favoris');
      refetch();
      onFavoriteChange?.(false);
    },
    onError: (error) => {
      showError(`Erreur: ${error.message}`);
    },
  });

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeFromFavorites({ variables: { activityId } });
    } else {
      await addToFavorites({ variables: { activityId } });
    }
  };

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
