import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Users } from 'database/entities/Users';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserPublicDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  middleName?: string;

  @ApiPropertyOptional()
  avatar?: string;

  constructor(user: Users) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.middleName = user.middleName || '';
    this.avatar = user.avatar || '';
  }
}

export class UserDto extends UserPublicDto {
  @ApiProperty()
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  social?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  isActive: boolean;

  constructor(user: Users) {
    super(user);
    this.email = user.email || '';
    this.address = user.address || '';
    this.phone = user.phone || '';
    this.isActive = user.isActive;
  }
}
