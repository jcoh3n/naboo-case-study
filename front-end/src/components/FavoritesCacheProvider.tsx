import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@apollo/client';
import { getFavoritesQuery } from '../graphql/favorites';
import { useAuth } from '../hooks/useAuth';

/**
 * Interface du contexte de cache des favoris
 */
interface FavoritesCacheContextType {
  /** Liste complète des activités favorites avec toutes leurs données */
  favorites: any[];
  /** Liste des IDs des favoris pour vérifications rapides */
  favoriteIds: string[];
  /** Indique si une opération de chargement est en cours */
  isLoading: boolean;
  /** Fonction pour forcer la re-synchronisation du cache */
  refetch: () => void;
}

// Contexte React pour le cache global des favoris
const FavoritesCacheContext = createContext<FavoritesCacheContextType | undefined>(undefined);

/**
 * Props du provider de cache des favoris
 */
interface FavoritesCacheProviderProps {
  /** Composants enfants qui auront accès au cache */
  children: ReactNode;
}

/**
 * Provider de cache global pour les favoris utilisateur
 * 
 * Ce composant utilise Apollo Client pour maintenir un cache centralisé
 * des favoris de l'utilisateur connecté. Il fournit :
 * - Les données complètes des activités favorites
 * - Une liste d'IDs pour des vérifications rapides
 * - Un état de chargement global
 * - Une fonction de re-synchronisation
 * 
 * Stratégie de cache : 'cache-and-network' pour équilibrer
 * performance et fraîcheur des données.
 */
export const FavoritesCacheProvider: React.FC<FavoritesCacheProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Query Apollo avec stratégie de cache optimisée
  const { data, loading, refetch } = useQuery(getFavoritesQuery, {
    skip: !user, // Ne pas exécuter si utilisateur non connecté
    fetchPolicy: 'cache-and-network', // Cache d'abord, puis réseau si nécessaire
  });

  // Extraction des données avec fallback sécurisé
  const favorites = data?.getFavorites || [];
  const favoriteIds = favorites.map((activity: any) => activity.id);

  // Valeur du contexte fournie aux composants enfants
  const value: FavoritesCacheContextType = {
    favorites,
    favoriteIds,
    isLoading: loading,
    refetch,
  };

  return (
    <FavoritesCacheContext.Provider value={value}>
      {children}
    </FavoritesCacheContext.Provider>
  );
};

/**
 * Hook pour accéder au cache des favoris depuis n'importe quel composant
 * 
 * @throws Error si utilisé en dehors d'un FavoritesCacheProvider
 * @returns Contexte des favoris avec toutes les données et fonctions
 */
export const useFavoritesCache = (): FavoritesCacheContextType => {
  const context = useContext(FavoritesCacheContext);
  if (context === undefined) {
    throw new Error('useFavoritesCache must be used within a FavoritesCacheProvider');
  }
  return context;
};
