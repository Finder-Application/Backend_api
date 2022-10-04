import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetSession } from 'decorators';
import { Session } from 'interfaces/request';
import { UserDto } from './dtos/user.dto';

import { UserService } from './user.service';

@ApiTags('users')
@Controller('private/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get me',
    type: UserDto,
  })
  getMe(@GetSession() session: Session): Promise<UserDto> {
    return this.userService.findOne({ id: session.userId });
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

  @Put('someOne/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get me',
    type: UserDto,
  })
  getMe(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findOne({ id });
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
