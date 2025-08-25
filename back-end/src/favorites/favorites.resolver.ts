import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { User } from '../user/user.schema';
import { Activity } from '../activity/activity.schema';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PayloadDto } from '../auth/types/jwtPayload.dto';

@Resolver()
@UseGuards(AuthGuard)
export class FavoritesResolver {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Mutation(() => User)
  async addToFavorites(
    @Args('activityId') activityId: string,
    @CurrentUser() user: PayloadDto,
  ): Promise<User> {
    return this.favoritesService.addToFavorites(user.id, activityId);
  }

  @Mutation(() => User)
  async removeFromFavorites(
    @Args('activityId') activityId: string,
    @CurrentUser() user: PayloadDto,
  ): Promise<User> {
    return this.favoritesService.removeFromFavorites(user.id, activityId);
  }

  @Mutation(() => User)
  async reorderFavorites(
    @Args('activityIds', { type: () => [String] }) activityIds: string[],
    @CurrentUser() user: PayloadDto,
  ): Promise<User> {
    return this.favoritesService.reorderFavorites(user.id, activityIds);
  }

  @Query(() => [Activity])
  async getFavorites(@CurrentUser() user: PayloadDto): Promise<Activity[]> {
    return this.favoritesService.getFavorites(user.id);
  }

  @Query(() => Boolean)
  async isFavorite(
    @Args('activityId') activityId: string,
    @CurrentUser() user: PayloadDto,
  ): Promise<boolean> {
    return this.favoritesService.isFavorite(user.id, activityId);
  }
}
