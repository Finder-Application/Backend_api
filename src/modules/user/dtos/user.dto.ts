import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Users } from 'database/entities/Users';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserPublicDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiPropertyOptional()
  middleName?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  uuid?: number;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  address?: string;

  constructor(user?: Partial<Users>, hasContact?: boolean) {
    if (user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.middleName = user.middleName || '';
      this.avatar = user.avatar || '';
      this.uuid = user.id;
      if (hasContact) {
        this.email = String(user.email);
        this.phone = String(user.phone);
        this.address = String(user.address);
      }
    }
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
