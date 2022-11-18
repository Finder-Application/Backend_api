import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreatePostDto } from 'modules/post/dtos/create-post.dto';
import { FaceCollection } from 'modules/post/dtos/face-descriptor.dto';
import { ApiConfigService } from 'shared/services/api-config.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private fireStore: admin.firestore.Firestore;
  private collection = 'faces';
  constructor(private apiConfig: ApiConfigService) {}

  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert(this.apiConfig.firebaseConfig),
    });
    this.fireStore = admin.app().firestore();
  }

  async saveDescriptors(
    user_id: number,
    post_id: number,
    descriptors?: CreatePostDto['descriptors'],
  ) {
    if (!descriptors?.length) {
      return null;
    }
    return this.fireStore.collection(this.collection).doc(String(post_id)).set({
      post_id,
      descriptors,
      user_id,
    });
  }
  async deleteDescriptors(post_id: string) {
    try {
      await this.fireStore.collection(this.collection).doc(post_id).delete();
    } catch (error) {
      console.info('deleteDescriptors', error);
    }
  }
  async updateDescriptors(
    post_id: string,
    user_id: number,
    photosIdRemoved?: string[],
    descriptorsUpdated?: FaceCollection['descriptors'],
  ) {
    if (!photosIdRemoved?.length && !descriptorsUpdated?.length) {
      return null;
    }

    const documents = await this.fireStore
      .collection(this.collection)
      .doc(post_id)
      .get();
    const currentData = documents.data() as FaceCollection;
    const filterDescriptors = currentData.descriptors.filter(descriptor =>
      photosIdRemoved?.includes(descriptor.id),
    );
    return await this.fireStore
      .collection(this.collection)
      .doc(post_id)
      .set({
        post_id,
        user_id,
        descriptors: [...filterDescriptors, ...(descriptorsUpdated || [])],
      });
  }
}
