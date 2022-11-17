import { Posts } from 'database/entities/Posts';
import { DateService } from './../../../shared/services/Date.service';
import { CreatePostDto } from './create-post.dto';

export class PostDBDto extends Posts {
  constructor(post: CreatePostDto) {
    super();
    this.gender = post.gender || null;
    this.fullName = post.fullName;
    this.hometownRegion = post.hometown?.region || null;
    this.hometownState = post.hometown?.state || null;
    this.hometownHamlet = post.hometown?.hamlet || null;
    this.hometownCommune = post.hometown?.commune || null;
    this.dateOfBirth = DateService.getOnlyDate(post.dateOfBirth) || null;
    this.description = post.description || null;
    this.missingCommune = post.missingAddress?.commune || null;
    this.missingHamlet = post.missingAddress?.hamlet || null;
    this.missingRegion = post.missingAddress?.region || null;
    this.missingTime =
      (DateService.getOnlyDate(post.missingTime) as any) || null;
    this.photos = post.photos?.join(',') || '';
    this.title = post.title;
    this.nickname = post.nickname;
  }
}
