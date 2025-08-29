import { ApiProperty } from "@nestjs/swagger";

export class User {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    readOnly: true,
  })
  id: string;
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    readOnly: true,
  })
  email: string;
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    readOnly: true,
  })
  name: string;
  @ApiProperty({
    description: 'The provider ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    readOnly: true,
  })
  providerId: string;
  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.png',
    readOnly: true,
  })
  avatarUrl: string;
  @ApiProperty({
    description: 'The date and time the user was created',
    example: '2021-01-01T00:00:00.000Z',
    readOnly: true,
  })
  createdAt: Date;
  @ApiProperty({
    description: 'The date and time the user was updated',
    example: '2021-01-01T00:00:00.000Z',
    readOnly: true,
  })
  updatedAt: Date;
}