import { Posts } from 'database/entities/Posts';
import { UserPublicDto } from 'modules/user/dtos/user.dto';

export class PostResDto extends Posts {
  hometown: Record<string, string | null> = {};
  missingAddress: Record<string, string | null> = {};
  owner: UserPublicDto | Record<string, string>;
  constructor(post: Posts, hasContact?: boolean) {
    super();
    for (const key of Object.keys(post)) {
      if (
        key !== 'user' &&
        !key.includes('hometown') &&
        !key.includes('missing') &&
        !key.includes('relevantPosts')
      ) {
        this[key] = post[key];
      }
    }
    this.hometown.commune = post.hometownCommune;
    this.hometown.hamlet = post.hometownHamlet;
    this.hometown.region = post.hometownRegion;
    this.hometown.state = post.hometownState;
    this.missingAddress.commune = post.missingCommune;
    this.missingAddress.hamlet = post.missingHamlet;
    this.missingAddress.region = post.missingRegion;
    this.missingAddress.state = post.missingState;
    this.missingTime = post.missingTime;
    this.gender = post.gender;
    this.photos = (post.photos?.split(',') || []) as unknown as string;
    this.owner = new UserPublicDto(post.user, hasContact);
  }
}
