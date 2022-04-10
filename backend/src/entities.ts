import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    unique: true,
    nullable: false,
    length: 16,
  })
  username?: string;
}

@Entity({ name: "games" })
export class Game {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    nullable: false,
    length: 1024,
  })
  state?: string;
}
