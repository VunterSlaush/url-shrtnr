import { cookies } from "next/headers";

export const getUser = async () => {
    const cookieStore = await cookies();
    const user = cookieStore.get('user_name')?.value;
    const avatar = cookieStore.get('user_avatar')?.value;
    return { user, avatar };
}

export const isLoggedIn = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    return token?.value !== undefined;
}