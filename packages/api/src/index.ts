
import { User } from './users/user';
import { UserDto } from './users/user.dto';
import { UrlDto } from './urls/url.dto';
import { CreateUrlDto } from './urls/create-url.dto';
import { Url } from './urls/url';
import { AppError } from './error';
import { CreateUrlTrackingDto } from './url-tracking/create-tracking.dto';
import { UrlTracking } from 'url-tracking/url-tracking';

export const users = {
  UserDto,
  User,
};

export const urls = {
  UrlDto,
  CreateUrlDto,
  Url,
};

export const error = {
  AppError,
};

export const urlTracking = {
  CreateUrlTrackingDto,
  UrlTracking,
};

export { AppError } from './error';
