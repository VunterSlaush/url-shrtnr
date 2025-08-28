import { User } from '@repo/api/users/user';

export class UserMapper {
    static mapRowToUser(row: any): User {
        const user = new User();
        user.id = row.id;
        user.email = row.email;
        user.name = row.name;
        user.providerId = row.provider_id;
        user.avatarUrl = row.avatar_url;
        user.createdAt = row.created_at;
        user.updatedAt = row.updated_at;

        return user;
    }

    static mapRowsToUsers(rows: any[]): User[] {
        return rows.map(row => this.mapRowToUser(row));
    }
}
