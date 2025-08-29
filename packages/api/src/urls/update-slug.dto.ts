import { ApiProperty } from "@nestjs/swagger";

export class UpdateSlugDto {
  @ApiProperty({
    description: 'The slug of the URL',
    example: 'new-slug',
  })
  slug: string;
}
