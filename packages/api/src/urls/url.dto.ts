import { User } from "users/user";

export class UrlDto {
  id: string;
  url: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}