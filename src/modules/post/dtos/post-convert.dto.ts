import { Posts } from 'database/entities/Posts';
import { CreatePostDto } from './create-post.dto';

export class PostConvertToDBDto extends Posts {
  constructor(post: CreatePostDto) {
    super();
    this.gender = post.gender;
    this.fullName = post.fullName;
    this.hometownRegion = post.hometown?.region || null;
    this.hometownState = post.hometown?.state || null;
    this.hometownHamlet = post.hometown?.hamlet || null;
    this.hometownCommune = post.hometown?.commune || null;
    this.dateOfBirth =
      (post.dateOfBirth && new Date(post.dateOfBirth).toISOString())?.split(
        'T',
      )[0] || null;
    this.description = post.description || null;
    this.missingCommune = post.missingAddress?.commune || null;
    this.missingHamlet = post.missingAddress?.hamlet || null;
    this.missingRegion = post.missingAddress?.region || null;
    this.missingTime = post.missingTime || null;
    this.photos = post.photos?.join(',') || null;
    this.title = post.title;
  }
}
