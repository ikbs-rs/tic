/*
* Za sada klase ne trebaju
*/
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, MaxLength, validate} from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';

@Entity()
export class AdmAction  extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  site: number;

  @Column()
  @IsString()
  @MaxLength(4)
  stext: string;

  @Column({ nullable: true })
  @IsNumber()
  cre_action: number | null;

  @Column({ nullable: true })
  @IsNumber()
  upd_action: number | null;

  @Column({ nullable: true })
  @IsNumber()
  del_action: number | null;

  @Column({ nullable: true })
  @IsNumber()
  exe_action: number | null;

  @Column({ nullable: true })
  @IsNumber()
  all_action: number | null;
}

export function validateAdmAction(jsonObject: any): Promise<void> {
  const admAction = plainToClass(AdmAction, jsonObject);
  return validate(admAction).then((errors) => {
    if (errors.length > 0) {
      console.log('Nevalidan JSON objekat. Greške:');
      console.log(errors);
      throw new Error('Nevalidan JSON objekat.');
    } else {
      console.log('Validan JSON objekat.');
    }
  });
}

const admActionTableSql = `CREATE TABLE iis.adm_action (
  id numeric(20) NOT NULL,
  site numeric(20) NOT NULL,
  stext varchar(4) NOT NULL,
  cre_action numeric(1) NULL,
  upd_action numeric(1) NULL,
  del_action numeric(1) NULL,
  exe_action numeric(1) NULL,
  all_action numeric(1) NULL,
  CONSTRAINT pk_adm_rolaakcija PRIMARY KEY (id)
);`;

console.log(admActionTableSql);
