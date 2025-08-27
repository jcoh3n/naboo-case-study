import { gql } from '@apollo/client';

/**
 * Opérations GraphQL pour la gestion des favoris
 * 
 * Ce fichier contient toutes les mutations et queries nécessaires
 * pour interagir avec l'API des favoris. Les fragments sont utilisés
 * pour éviter la duplication et assurer la cohérence des données.
 */

// === MUTATIONS ===

/**
 * Mutation pour ajouter une activité aux favoris
 * Retourne l'utilisateur mis à jour avec ses favoris complets
 */
export const addToFavoritesMutation = gql`
  mutation AddToFavorites($activityId: String!) {
    addToFavorites(activityId: $activityId) {
      id
      favoriteActivities {
        id
        name
        city
        description
        price
        createdAt
        owner {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

/**
 * Mutation pour retirer une activité des favoris
 * Retourne l'utilisateur mis à jour avec ses favoris complets
 */
export const removeFromFavoritesMutation = gql`
  mutation RemoveFromFavorites($activityId: String!) {
    removeFromFavorites(activityId: $activityId) {
      id
      favoriteActivities {
        id
        name
        city
        description
        price
        createdAt
        owner {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

/**
 * Mutation pour réorganiser l'ordre des favoris (drag & drop)
 * Prend un tableau ordonné d'IDs et met à jour l'ordre en base
 */
export const reorderFavoritesMutation = gql`
  mutation ReorderFavorites($activityIds: [String!]!) {
    reorderFavorites(activityIds: $activityIds) {
      id
      favoriteActivities {
        id
        name
        city
        description
        price
        createdAt
        owner {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

// === QUERIES ===

/**
 * Query pour récupérer tous les favoris de l'utilisateur connecté
 * Retourne la liste complète des activités avec leurs données
 */
export const getFavoritesQuery = gql`
  query GetFavorites {
    getFavorites {
      id
      name
      city
      description
      price
      createdAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

/**
 * Query pour vérifier si une activité spécifique est favorite
 * Utile pour des vérifications ponctuelles sans charger tous les favoris
 */
export const isFavoriteQuery = gql`
  query IsFavorite($activityId: String!) {
    isFavorite(activityId: $activityId)
  }
`;
