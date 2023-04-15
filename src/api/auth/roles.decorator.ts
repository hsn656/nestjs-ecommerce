import { SetMetadata } from '@nestjs/common';

export const Roles = (...roleIds: number[]) => SetMetadata('roleIds', roleIds);
