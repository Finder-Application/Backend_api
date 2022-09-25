import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

@ApiTags('users')
@Controller('private/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe() {
    return 'me';
  }

  //   @Get()
  //   @Auth([RoleType.USER])
  //   @HttpCode(HttpStatus.OK)
  //   @ApiPageOkResponse({
  //     description: "Get users list",
  //     type: PageDto,
  //   })
  //   getUsers(
  //     @Query(new ValidationPipe({ transform: true }))
  //     pageOptionsDto: UsersPageOptionsDto
  //   ): Promise<PageDto<UserDto>> {
  //     return this.userService.getUsers(pageOptionsDto);
  //   }

  //   @Get(":id")
  //   @Auth([RoleType.USER])
  //   @HttpCode(HttpStatus.OK)
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //     description: "Get users list",
  //     type: UserDto,
  //   })
  //   getUser(@UUIDParam("id") userId: Uuid): Promise<UserDto> {
  //     return this.userService.getUser(userId);
  //   }
}

@ApiTags('users public')
@Controller('public/users')
export class UserPublicController {
  constructor(private userService: UserService) {}

  @Get('someOne')
  getMe() {
    return 'someOne';
  }

  //   @Get()
  //   @Auth([RoleType.USER])
  //   @HttpCode(HttpStatus.OK)
  //   @ApiPageOkResponse({
  //     description: "Get users list",
  //     type: PageDto,
  //   })
  //   getUsers(
  //     @Query(new ValidationPipe({ transform: true }))
  //     pageOptionsDto: UsersPageOptionsDto
  //   ): Promise<PageDto<UserDto>> {
  //     return this.userService.getUsers(pageOptionsDto);
  //   }

  //   @Get(":id")
  //   @Auth([RoleType.USER])
  //   @HttpCode(HttpStatus.OK)
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //     description: "Get users list",
  //     type: UserDto,
  //   })
  //   getUser(@UUIDParam("id") userId: Uuid): Promise<UserDto> {
  //     return this.userService.getUser(userId);
  //   }
}
