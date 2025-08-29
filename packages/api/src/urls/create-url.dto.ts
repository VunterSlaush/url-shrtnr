import { ApiProperty } from "@nestjs/swagger";

export class CreateUrlDto {
  @ApiProperty({
    description: 'The URL to shorten',
    example: 'https://www.google.com',
  })
  url: string;
  @ApiProperty({
    description: 'The slug of the URL',
    example: 'xHy48Ck',
    required: false,
  })
  slug?: string;
}