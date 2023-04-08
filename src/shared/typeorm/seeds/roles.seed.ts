import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from '../../../api/role/role.entity';
import { RoleIds, Roles } from '../../../api/role/role.enum';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([
        { id: RoleIds.Customer, name: Roles.Customer },
        { id: RoleIds.Merchant, name: Roles.Merchant },
        { id: RoleIds.Admin, name: Roles.Admin },
      ])
      .execute();
    console.log('ssssssssssssss322444444444444444441sss');
    // await factory(Role)().create({
    //   id: RoleIds.Customer,
    //   name: Roles.Customer,
    // });
    // await factory(Role)().create({
    //   id: RoleIds.Merchant,
    //   name: Roles.Merchant,
    // });
    // await factory(Role)().create({
    //   id: RoleIds.Admin,
    //   name: Roles.Admin,
    // });
  }
}
