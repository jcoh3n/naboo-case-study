import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Int,
  Parent,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';
import { Activity } from './activity.schema';

import { CreateActivityInput } from './activity.inputs.dto';
import { ToggleDebugModeInput } from './toggle-debug-mode.input.dto';
import { User } from 'src/user/user.schema';
import { ContextWithJWTPayload } from 'src/auth/types/context';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly userServices: UserService,
  ) {}

  @ResolveField(() => ID)
  id(@Parent() activity: Activity): string {
    return activity._id.toString();
  }

  @ResolveField(() => User)
  async owner(@Parent() activity: Activity): Promise<User> {
    await activity.populate('owner');
    return activity.owner;
  }

  @ResolveField(() => Date, { nullable: true })
  async createdAt(
    @Parent() activity: Activity,
    @Context() context: ContextWithJWTPayload,
  ): Promise<Date | undefined> {
    // If there's no authenticated user, don't expose createdAt
    if (!context.jwtPayload) {
      return undefined;
    }

    // Fetch the full user object to check role and debug mode
    const user = await this.userServices.getById(context.jwtPayload.id);

    // Only expose createdAt if user is admin and debug mode is enabled
    if (user.role === 'admin' && user.debugModeEnabled) {
      return activity.createdAt;
    }

    return undefined;
  }

  @Query(() => [Activity])
  async getActivities(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Query(() => [Activity])
  async getLatestActivities(): Promise<Activity[]> {
    return this.activityService.findLatest();
  }

  @Query(() => [Activity])
  @UseGuards(AuthGuard)
  async getActivitiesByUser(
    @Context() context: ContextWithJWTPayload,
  ): Promise<Activity[]> {
    if (!context.jwtPayload) {
      throw new Error('User not authenticated');
    }
    return this.activityService.findByUser(context.jwtPayload.id);
  }

  @Query(() => [String])
  async getCities(): Promise<string[]> {
    const cities = await this.activityService.findCities();
    return cities;
  }

  @Query(() => [Activity])
  async getActivitiesByCity(
    @Args('city') city: string,
    @Args({ name: 'activity', nullable: true }) activity?: string,
    @Args({ name: 'price', nullable: true, type: () => Int }) price?: number,
  ): Promise<Activity[]> {
    return this.activityService.findByCity(city, activity, price);
  }

  @Query(() => Activity)
  async getActivity(@Args('id') id: string): Promise<Activity> {
    return this.activityService.findOne(id);
  }

  @Mutation(() => Activity)
  @UseGuards(AuthGuard)
  async createActivity(
    @Context() context: ContextWithJWTPayload,
    @Args('createActivityInput') createActivity: CreateActivityInput,
  ): Promise<Activity> {
    if (!context.jwtPayload) {
      throw new Error('User not authenticated');
    }
    return this.activityService.create(context.jwtPayload.id, createActivity);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async toggleDebugMode(
    @Context() context: ContextWithJWTPayload,
    @Args('toggleDebugModeInput') toggleDebugModeInput: ToggleDebugModeInput,
  ): Promise<User> {
    if (!context.jwtPayload) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Fetch the full user object to check role
    const user = await this.userServices.getById(context.jwtPayload.id);

    // Only allow admins to toggle debug mode
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can toggle debug mode');
    }

    // Update the user's debug mode
    return this.userServices.setDebugMode({
      userId: context.jwtPayload.id,
      enabled: toggleDebugModeInput.enabled,
    });
  }
}
