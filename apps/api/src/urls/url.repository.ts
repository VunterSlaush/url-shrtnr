import { Pool } from 'pg';
import { Result, ok, err } from 'neverthrow';
import { Url } from '@repo/api/urls/url';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { AppError } from '@repo/api/error';
import {
  createUrlQuery,
  findUrlByIdQuery,
  findUrlBySlugQuery,
  findUrlsByUserIdQuery,
  updateUrlQuery,
  deleteUrlQuery
} from './queries';
import { UrlMapper } from './url.mapper';
import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUrl,
  FindUrlById,
  FindUrlBySlug,
  FindUrlsByUserId,
  UpdateUrl,
  DeleteUrl
} from './url.interfaces';

@Injectable()
export class UrlRepository {
  constructor(
    @Inject('PG_POOL')
    private readonly pool: Pool
  ) { }

  create: CreateUrl = async (createUrlDto: CreateUrlDto, userId: string): Promise<Result<Url, AppError>> => {
    try {
      const { query, values } = createUrlQuery(createUrlDto, userId);
      const result = await this.pool.query(query, values);
      const url = UrlMapper.mapRowToUrl(result.rows[0]);
      return ok(url);
    } catch (error) {
      return err(AppError.unhandled('Failed to create URL', error));
    }
  };

  findById: FindUrlById = async (id: string): Promise<Result<Url, AppError>> => {
    try {
      const { query, values } = findUrlByIdQuery(id);
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        return err(AppError.notFound('URL not found'));
      }
      const url = UrlMapper.mapRowToUrl(result.rows[0]);
      return ok(url);
    } catch (error) {
      return err(AppError.unhandled('Failed to find URL by ID', error));
    }
  };

  findBySlug: FindUrlBySlug = async (slug: string): Promise<Result<Url, AppError>> => {
    try {
      const { query, values } = findUrlBySlugQuery(slug);
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        return err(AppError.notFound('URL not found'));
      }
      const url = UrlMapper.mapRowToUrl(result.rows[0]);
      return ok(url);
    } catch (error) {
      return err(AppError.unhandled('Failed to find URL by slug', error));
    }
  };

  findByUserId: FindUrlsByUserId = async (userId: string): Promise<Result<Url[], AppError>> => {
    try {
      const { query, values } = findUrlsByUserIdQuery(userId);
      const result = await this.pool.query(query, values);
      const urls = UrlMapper.mapRowsToUrls(result.rows);
      return ok(urls);
    } catch (error) {
      return err(AppError.unhandled('Failed to find URLs by user ID', error));
    }
  };

  update: UpdateUrl = async (id: string, updateData: Partial<CreateUrlDto>): Promise<Result<Url, AppError>> => {
    try {
      if (updateData.url === undefined && updateData.slug === undefined) {
        return this.findById(id);
      }

      const { query, values } = updateUrlQuery(updateData, id);
      const result = await this.pool.query(query, values);

      if (result.rows.length === 0) {
        return err(AppError.notFound('URL not found'));
      }
      const url = UrlMapper.mapRowToUrl(result.rows[0]);
      return ok(url);
    } catch (error) {
      if (error instanceof AppError) {
        return err(error);
      }
      return err(AppError.unhandled('Failed to update URL', error));
    }
  };

  delete: DeleteUrl = async (id: string): Promise<Result<boolean, AppError>> => {
    try {
      const { query, values } = deleteUrlQuery(id);
      const result = await this.pool.query(query, values);
      return ok(result.rowCount > 0);
    } catch (error) {
      return err(AppError.unhandled('Failed to delete URL', error));
    }
  };
}
