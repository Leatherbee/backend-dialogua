import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Level {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "int" })
    level: number;

    @Column({
        type: 'enum',
        enum: [
            'Multiple Choice',
            'Video Comprehension',
            'Form Filling',
            'Audio Compeherension',
            'Matching Item',
            'Sentence Order',
        ],
    })
    type: string;

    @Column({ type: 'varchar', nullable: true })
    banner: string | null;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deletedAt?: Date;
}
