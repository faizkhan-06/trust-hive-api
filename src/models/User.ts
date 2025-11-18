import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Business from "./Business";


@Entity({name: "users"})
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {nullable: false})
  email: string;

  @Column("varchar", {nullable: false})
  password: string;

  @Column({default: 1})
  is_active: boolean;

  @Column({default: 0})
  is_deleted: boolean;

  @Column('datetime')
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @Column('datetime')
  deleted_at: Date;

  @OneToOne(() => Business, (Business) => Business.user)
  business: Business;
}


export default User;