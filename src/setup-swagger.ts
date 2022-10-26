import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Finder API')
    .setDescription(
      ` 
Routes is following REST standard (Richardson level 3)

<details><summary>Detailed table</summary>
<p>

**Comments:**

    export class comments {
        @PrimaryGeneratedColumn({ type: "int", name: "id" })
        id: number;
    
        @Column("int", { name: "post_id" })
        postId: number;
    
        @Column("int", { name: "user_id" })
        userId: number;
    
        @Column("varchar", { name: "photo", nullable: true, length: 200 })
        photo: string | null;
    
        @Column("text", { name: "content" })
        content: string;
    
        @Column("int", { name: "likes", default: () => "'0'" })
        likes: number;
    }

**Posts:**
  
    export class posts {
        @PrimaryGeneratedColumn({ type: "int", name: "id" })
        id: number;
    
        @Column("int", { name: "user_id" })
        userId: number;
    
        @Column("varchar", { name: "first_name", length: 45 })
        firstName: string;
    
        @Column("varchar", { name: "lats_name", length: 45 })
        latsName: string;
    
        @Column("datetime", { name: "date_of_birth", nullable: true })
        dateOfBirth: Date | null;
    
        @Column("tinyint", { name: "gender", nullable: true, width: 1 })
        gender: boolean | null;
    
        @Column("varchar", { name: "lost_address", nullable: true, length: 200 })
        lostAddress: string | null;
    
        @Column("varchar", { name: "hometown", nullable: true, length: 200 })
        hometown: string | null;
    
        @Column("datetime", { name: "lost_time", nullable: true })
        lostTime: Date | null;
    
        @Column("varchar", { name: "relationship", nullable: true, length: 45 })
        relationship: string | null;
    
        @Column("varchar", { name: "photos", nullable: true, length: 500 })
        photos: string | null;
    
        @Column("varchar", { name: "relevant_posts", nullable: true, length: 45 })
        relevantPosts: string | null;
    
        @Column("int", { name: "share_count", nullable: true, default: () => "'0'" })
        shareCount: number | null;
    }

**Users:**

    export class Users {
        @PrimaryGeneratedColumn({ type: "int", name: "id" })
        id: number;
    
        @Column("int", { name: "account_id" })
        accountId: number;
    
        @Column("varchar", { name: "first_name", length: 45 })
        firstName: string;
    
        @Column("varchar", { name: "middle_name", nullable: true, length: 45 })
        middleName: string | null;
    
        @Column("varchar", { name: "last_name", length: 45 })
        lastName: string;
    
        @Column("tinyint", { name: "is_active", width: 1, default: () => "'1'" })
        isActive: boolean;
    
        @Column("varchar", {
        name: "avatar",
        nullable: true,
        length: 300,
        avatar: string | null;
    
        @Column("varchar", { name: "social", nullable: true, length: 200 })
        social: string | null;
    
        @Column("varchar", { name: "phone", nullable: true, length: 50 })
        phone: string | null;
    
        @Column("varchar", { name: "address", nullable: true, length: 200 })
        address: string | null;
    
        @Column("varchar", { name: "email", nullable: true, length: 50 })
        email: string | null;
    
        @Column("datetime", {
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP",
        })
        createdAt: Date;
    
        @Column("datetime", {
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP",
        })
        updatedAt: Date;
    }

</p>
</details>`,
    )
    .addBearerAuth();

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
