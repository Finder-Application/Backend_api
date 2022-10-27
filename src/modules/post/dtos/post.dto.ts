import { Posts } from 'database/entities/Posts';
import { UserPublicDto } from 'modules/user/dtos/user.dto';

export class PostConvertToResDto extends Posts {
  private owner: UserPublicDto;
  private hometown: Record<string, string | null> = {};
  private missingAddress: Record<string, string | null> = {};
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
    this.missingAddress.state = post.missingState;
    this.missingTime = post.missingTime;
    this.photos = post.photos?.split(',') as unknown as string;
    this.owner = new UserPublicDto(post.user);
  }
}
