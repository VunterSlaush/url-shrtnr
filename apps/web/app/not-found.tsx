import Link from 'next/link';

export default function NotFound() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-lg">Sorry, this page doesn&apos;t exist.</p>
            <Link
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 active:shadow-inner"
            >
                Go to Homepage
            </Link>
        </div>
    );
}