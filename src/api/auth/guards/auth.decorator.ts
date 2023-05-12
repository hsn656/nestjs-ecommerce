import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

export function Auth(...roleIds: number[]) {
  return applyDecorators(
    SetMetadata('roleIds', roleIds),
    UseGuards(AuthGuard, RolesGuard),
  );
}
