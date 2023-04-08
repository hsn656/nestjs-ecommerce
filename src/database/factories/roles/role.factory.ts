import { Role } from 'src/api/role/role.entity';
import { define } from 'typeorm-seeding';

define(Role, () => {
  console.log('sssssssssssssqqqqqqqqqqqqqqqqqqq');
  const role = new Role();
  return role;
});
