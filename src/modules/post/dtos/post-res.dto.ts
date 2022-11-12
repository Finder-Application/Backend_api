import { Posts } from 'database/entities/Posts';
import { UserPublicDto } from 'modules/user/dtos/user.dto';

export class PostResDto extends Posts {
  hometown: Record<string, string | null> = {};
  missingAddress: Record<string, string | null> = {};
  owner: UserPublicDto | Record<string, string>;
  constructor(post: Posts) {
    super();
    for (const key of Object.keys(post)) {
      if (
        key !== 'user' &&
        !key.includes('hometown') &&
        !key.includes('missing')
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
    this.missingTime = post.missingTime;
    this.photos = post.photos?.split(',') as unknown as string;
    this.owner = new UserPublicDto(post.user);
  }
}
