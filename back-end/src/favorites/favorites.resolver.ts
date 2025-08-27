import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { User } from '../user/user.schema';
import { Activity } from '../activity/activity.schema';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PayloadDto } from '../auth/types/jwtPayload.dto';

/**
 * Resolver GraphQL pour les opérations de favoris
 * 
 * Toutes les opérations sont protégées par authentification JWT.
 * Le décorateur @CurrentUser() injecte automatiquement les données
 * de l'utilisateur connecté depuis le token JWT.
 * 
 * API disponible :
 * - Mutations : addToFavorites, removeFromFavorites, reorderFavorites
 * - Queries : getFavorites, isFavorite
 */
@Resolver()
@UseGuards(AuthGuard) // Protection JWT sur toutes les opérations
export class FavoritesResolver {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * Mutation pour ajouter une activité aux favoris
   * 
   * @param activityId - ID de l'activité à ajouter
   * @param user - Utilisateur connecté (injecté automatiquement)
   * @returns Promise<User> - Utilisateur mis à jour avec ses favoris
   */
  @Mutation(() => User)
  async addToFavorites(
    @Args('activityId') activityId: string,
    @CurrentUser() user: PayloadDto,
  ): Promise<User> {
    return this.favoritesService.addToFavorites(user.id, activityId);
  }

  /**
   * Mutation pour retirer une activité des favoris
   * 
   * @param activityId - ID de l'activité à retirer
   * @param user - Utilisateur connecté (injecté automatiquement)
   * @returns Promise<User> - Utilisateur mis à jour avec ses favoris
   */
  @Mutation(() => User)
  async removeFromFavorites(
    @Args('activityId') activityId: string,
    @CurrentUser() user: PayloadDto,
  ): Promise<User> {
    return this.favoritesService.removeFromFavorites(user.id, activityId);
  }

  /**
   * Mutation pour réorganiser l'ordre des favoris (drag & drop)
   * 
   * @param activityIds - Tableau ordonné des IDs d'activités
   * @param user - Utilisateur connecté (injecté automatiquement)
   * @returns Promise<User> - Utilisateur mis à jour avec le nouvel ordre
   */
  @Mutation(() => User)
  async reorderFavorites(
    @Args('activityIds', { type: () => [String] }) activityIds: string[],
    @CurrentUser() user: PayloadDto,
  ): Promise<User> {
    return this.favoritesService.reorderFavorites(user.id, activityIds);
  }

  /**
   * Query pour récupérer tous les favoris de l'utilisateur
   * 
   * @param user - Utilisateur connecté (injecté automatiquement)
   * @returns Promise<Activity[]> - Liste des activités favorites
   */
  @Query(() => [Activity])
  async getFavorites(@CurrentUser() user: PayloadDto): Promise<Activity[]> {
    return this.favoritesService.getFavorites(user.id);
  }

  /**
   * Query pour vérifier si une activité est favorite
   * 
   * @param activityId - ID de l'activité à vérifier
   * @param user - Utilisateur connecté (injecté automatiquement)
   * @returns Promise<boolean> - true si favorite, false sinon
   */
  @Query(() => Boolean)
  async isFavorite(
    @Args('activityId') activityId: string,
    @CurrentUser() user: PayloadDto,
  ): Promise<boolean> {
    return this.favoritesService.isFavorite(user.id, activityId);
  }
}
