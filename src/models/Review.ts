import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Business from "./Business";

@Entity({ name: "reviews" })
class Review {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("double")
  rating: number;

  @Column("varchar")
  review_text: string;

  @Column("char")
  business_id: string;

  @Column()
  is_active: boolean;

  @Column()
  is_deleted: boolean;

  @Column("timestamp")
  @CreateDateColumn()
  created_at: Date;

  @Column("timestamp")
  deleted_at: Date;


  @ManyToOne(() => Business, (Business) => Business.reviews)
  @JoinColumn({ name: "business_id" })
  business: Business;
}

export default Review;
