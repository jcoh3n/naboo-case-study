import { useState, useEffect } from 'react';
import { useFavoritesCache } from '../components/FavoritesCacheProvider';

/**
 * Interface de retour du hook useFavoriteState
 */
interface UseFavoriteStateReturn {
  /** Indique si l'activité est dans les favoris */
  isFavorite: boolean;
  /** Indique si une opération de chargement est en cours */
  isLoading: boolean;
  /** Fonction pour forcer la re-synchronisation du cache */
  refetch: () => void;
}

/**
 * Hook personnalisé pour gérer l'état favori d'une activité individuelle
 * 
 * Ce hook utilise le cache global des favoris (FavoritesCacheProvider)
 * pour déterminer l'état favori d'une activité spécifique.
 * Il se synchronise automatiquement avec les changements du cache.
 * 
 * @param activityId - ID de l'activité à surveiller
 * @returns Objet contenant l'état favori et les fonctions de contrôle
 */
export const useFavoriteState = (activityId: string): UseFavoriteStateReturn => {
  const { favoriteIds, isLoading, refetch } = useFavoritesCache();
  const [isFavorite, setIsFavorite] = useState(false);

  // Synchronisation automatique avec le cache global
  useEffect(() => {
    setIsFavorite(favoriteIds.includes(activityId));
  }, [favoriteIds, activityId]);

  return {
    isFavorite,
    isLoading,
    refetch,
  };
};
