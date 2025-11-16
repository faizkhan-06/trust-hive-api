import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Business from "./Business";


@Entity({name: "users"})
class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("varchar")
  email: string;

  @Column("varchar")
  password: string;

  @Column()
  is_active: boolean;

  @Column()
  is_deleted: boolean;

  @Column('timestamp')
  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp')
  deleted_at: Date;

  @OneToOne(() => Business, (Business) => Business.user)
  business: Business;
}


export default User;