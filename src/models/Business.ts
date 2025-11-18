import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./User";
import Review from "./Review";

@Entity({ name: "businesses" })
class Business {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  slug: string;

  @Column("varchar")
  type: string;

  @Column("char")
  user_id: string;

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

  @OneToOne(() => User)
  @JoinColumn({name: "user_id"})
  user: User;

  @OneToMany(() => Review, (Review) => Review.business)
  reviews: Review[];
}

export default Business;
