import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;
  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.png',
  })
  avatarUrl: string;
}