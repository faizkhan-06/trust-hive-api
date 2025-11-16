import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";
import Review from "./Review";

@Entity({ name: "businesses" })
class Business {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  slug: string;

  @Column("varchar")
  type: string;

  @Column("char")
  user_id: string;

  @Column()
  is_active: boolean;

  @Column()
  is_deleted: boolean;

  @Column("timestamp")
  @CreateDateColumn()
  created_at: Date;

  @Column("timestamp")
  deleted_at: Date;

  @OneToOne(() => User)
  @JoinColumn({name: "user_id"})
  user: User;

  @OneToMany(() => Review, (Review) => Review.business)
  reviews: Review[];
}

export default Business;
