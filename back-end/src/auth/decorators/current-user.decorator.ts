import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PayloadDto } from '../types/jwtPayload.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): PayloadDto => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().jwtPayload;
  },
);
