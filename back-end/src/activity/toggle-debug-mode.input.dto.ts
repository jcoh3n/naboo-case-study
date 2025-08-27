import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@InputType()
export class ToggleDebugModeInput {
  @Field()
  @IsBoolean()
  enabled!: boolean;
}