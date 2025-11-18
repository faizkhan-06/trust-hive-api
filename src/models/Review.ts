import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Business from "./Business";

@Entity({ name: "reviews" })
class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("double")
  rating: number;

  @Column("varchar")
  review_text: string;

  @Column("char")
  business_id: string;

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


  @ManyToOne(() => Business, (Business) => Business.reviews)
  @JoinColumn({ name: "business_id" })
  business: Business;
}

export default Review;
