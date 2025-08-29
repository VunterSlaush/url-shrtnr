import { ApiProperty } from "@nestjs/swagger";

export class UrlTracking {
    @ApiProperty({
        description: 'The ID of the URL tracking',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;
    @ApiProperty({
        description: 'The ID of the URL',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    urlId: string;
    @ApiProperty({
        description: 'The referrer domain',
        example: 'https://www.google.com',
    })
    referrerDomain?: string;
    @ApiProperty({
        description: 'The browser',
        example: 'Chrome',
    })
    browser?: string;
    @ApiProperty({
        description: 'The operating system',
        example: 'Windows',
    })
    operatingSystem?: string;
    @ApiProperty({
        description: 'The device type',
        example: 'desktop',
    })
    deviceType?: string;
    @ApiProperty({
        description: 'The language',
        example: 'en',
    })
    language?: string;
    @ApiProperty({
        description: 'The IP address',
        example: '127.0.0.1',
    })
    ipAddress?: string;
    @ApiProperty({
        description: 'The date and time the URL tracking was created',
        example: '2021-01-01T00:00:00.000Z',
    })
    createdAt: Date;
    @ApiProperty({
        description: 'The date and time the URL tracking was created',
        example: '2021-01-01T00:00:00.000Z',
    })
    updatedAt: Date;
}