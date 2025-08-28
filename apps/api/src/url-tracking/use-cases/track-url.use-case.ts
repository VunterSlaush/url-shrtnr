import { Result, err } from 'neverthrow';
import { AppError } from '@repo/api/error';
import { CreateUrlTracking } from '../url-tracking.interfaces';
import { UrlTracking } from '@repo/api/url-tracking/url-tracking';
import { CreateUrlTrackingDto } from '@repo/api/url-tracking/create-tracking.dto';
import { UAParser } from 'ua-parser-js';

export class TrackUrlUseCase {
  constructor(
    private readonly createUrlTracking: CreateUrlTracking,
  ) { }

  async execute(urlId: string, headers: Record<string, string>): Promise<Result<UrlTracking, AppError>> {
    try {
      if (!urlId || urlId.trim().length === 0) {
        return err(AppError.validation('URL ID is required'));
      }

      const trackingData = this.headersToTrackingData(urlId, headers);

      return await this.createUrlTracking(trackingData);
    } catch (error) {
      return err(AppError.unhandled('Failed to track URL visit', error));
    }
  }

  headersToTrackingData(urlId: string, headers: Record<string, string>): CreateUrlTrackingDto {
    const parser = new UAParser(headers['user-agent']);
    const result = parser.getResult();

    return {
      urlId,
      referrerDomain: headers['referer'] ? new URL(headers['referer']).hostname : undefined,
      browser: result.browser.name,
      operatingSystem: result.os.name,
      deviceType: result.device.type || 'desktop',
      language: headers['accept-language']?.split(',')[0]?.split('-')[0],
      ipAddress: headers['x-forwarded-for']?.split(',')[0] || headers['x-real-ip'] || headers['remote-addr'],
    };
  }
}
