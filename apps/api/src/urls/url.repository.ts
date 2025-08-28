import { Pool } from 'pg';
import { Result, ok, err } from 'neverthrow';
import { Url } from '@repo/api/urls/url';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
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

  create: CreateUrl = async (createUrlDto: CreateUrlDto, userId: string): Promise<Result<Url, Error>> => {
    try {
      const { query, values } = createUrlQuery(createUrlDto, userId);
      const result = await this.pool.query(query, values);
      const url = UrlMapper.mapRowToUrl(result.rows[0]);
      return ok(url);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to create URL'));
    }
  };

  findById: FindUrlById = async (id: string): Promise<Result<Url, Error>> => {
    try {
      const { query, values } = findUrlByIdQuery(id);
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        return err(new Error('URL not found'));
      }
      const url = UrlMapper.mapRowToUrl(result.rows[0]);
      return ok(url);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to find URL by ID'));
    }
  };

  findBySlug: FindUrlBySlug = async (slug: string): Promise<Result<Url, Error>> => {
    try {
      const { query, values } = findUrlBySlugQuery(slug);
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        return err(new Error('URL not found'));
      }
      const url = UrlMapper.mapRowToUrl(result.rows[0]);
      return ok(url);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to find URL by slug'));
    }
  };

  findByUserId: FindUrlsByUserId = async (userId: string): Promise<Result<Url[], Error>> => {
    try {
      const { query, values } = findUrlsByUserIdQuery(userId);
      const result = await this.pool.query(query, values);
      const urls = UrlMapper.mapRowsToUrls(result.rows);
      return ok(urls);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to find URLs by user ID'));
    }
  };

  update: UpdateUrl = async (id: string, updateData: Partial<CreateUrlDto>): Promise<Result<Url, Error>> => {
    try {
      if (updateData.url === undefined && updateData.slug === undefined) {
        return this.findById(id);
      }

      const { query, values } = updateUrlQuery(updateData, id);
      const result = await this.pool.query(query, values);

      if (result.rows.length === 0) {
        return err(new Error('URL not found'));
      }
      const url = UrlMapper.mapRowToUrl(result.rows[0]);
      return ok(url);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to update URL'));
    }
  };

  delete: DeleteUrl = async (id: string): Promise<Result<boolean, Error>> => {
    try {
      const { query, values } = deleteUrlQuery(id);
      const result = await this.pool.query(query, values);
      return ok(result.rowCount > 0);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to delete URL'));
    }
  };
}
