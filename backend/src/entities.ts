import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    unique: true,
    nullable: false,
    length: 54,
  })
  username?: string;
}
