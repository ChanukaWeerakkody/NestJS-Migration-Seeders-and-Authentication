import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar',  unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false,unique: true })
  contact_number:string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({default:true})
  is_delete:boolean;

  @Column({ type: 'varchar', nullable: false })
  password: string;
    userRoles: any;
    userRolePermissions: any;
    businessAdmins: any;
    employees: any;
    otps: any;
  businessEmployees: any;
  
}
