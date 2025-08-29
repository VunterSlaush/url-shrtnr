import { ApiProperty } from "@nestjs/swagger";

export class Url {
  @ApiProperty({
    description: 'The ID of the URL',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
  @ApiProperty({
    description: 'The URL',
    example: 'https://www.google.com',
  })
  url: string;
  @ApiProperty({
    description: 'The slug of the URL',
    example: 'xHy48Ck',
  })
  slug: string;
  @ApiProperty({
    description: 'The date and time the URL was created',
    example: '2021-01-01T00:00:00.000Z',
    readOnly: true,
  })
  createdAt: Date;
  @ApiProperty({
    description: 'The date and time the URL was updated',
    example: '2021-01-01T00:00:00.000Z',
    readOnly: true,
  })
  updatedAt: Date;
  @ApiProperty({
    description: 'The date and time the URL was deleted',
    example: '2021-01-01T00:00:00.000Z',
    required: false,
    readOnly: true,
  })
  deletedAt: Date;
  @ApiProperty({
    description: 'The ID of the user who created the URL',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    readOnly: true,
  })
  userId?: string;
}