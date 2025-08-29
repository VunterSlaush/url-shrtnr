'use server'
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { signout } from '@repo/api-client';

export const logout = async () => {

    const allHeaders = await headers();
    await signout({
        headers: Object.fromEntries(allHeaders),
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    });

    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Clear each cookie
    allCookies.forEach(cookie => {
        cookieStore.set(cookie.name, '', {
            expires: new Date(0),
            path: '/',
        });
    });

    // Redirect to home page after logout
    redirect('/');
}
