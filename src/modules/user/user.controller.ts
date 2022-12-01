import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetSession } from 'decorators';
import { Session } from 'interfaces/request';
import { CommentIdDto } from './../comments/dtos/comment.dto';
import { UserUpdateDto } from './dtos/user-update.dto';

import { UserDto } from './dtos/user.dto';

import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth()
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
  @Post('up-like')
  upLikeOneComment(@Body() likeComment: CommentIdDto) {
    console.log(
      '🚀 ~ file: user.controller.ts:38 ~ UserController ~ upLikeOneComment ~ likeComment',
      likeComment,
    );
  }

  @Put('')
  async updateUser(
    @Body() body: UserUpdateDto,
    @GetSession() session: Session,
  ) {
    return this.userService.update(session.userId, body);
  }

  @Put('')
  async updateUser(
    @Body() body: UserUpdateDto,
    @GetSession() session: Session,
  ) {
    return this.userService.update(session.userId, body);
  }

  @Put('')
  async updateUser(
    @Body() body: UserUpdateDto,
    @GetSession() session: Session,
  ) {
    return this.userService.update(session.userId, body);
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

  @Get('info/:id')
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
