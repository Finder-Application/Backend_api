import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreatePostDto } from 'modules/post/dtos/create-post.dto';
import { ApiConfigService } from 'shared/services/api-config.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private fireStore: admin.firestore.Firestore;
  constructor(private apiConfig: ApiConfigService) {}

  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert(this.apiConfig.firebaseConfig),
    });
    this.fireStore = admin.app().firestore();
  }

  async saveDescriptors(
    descriptors?: CreatePostDto['descriptors'],
    post_id?: number,
  ) {
    if (!descriptors?.length || !post_id) {
      return null;
    }
    return this.fireStore.collection('faces').add({
      post_id,
      descriptors,
    });
  }
}
