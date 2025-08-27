# URL Shortener

A full-stack web application that allows users to create shortened URLs, similar to bit.ly or tinyurl.com. Built with React frontend and includes user management, analytics, and rate limiting features.

This project was developed as a technical assessment for Deep Origin.

## Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Slugs**: Allow users to customize their shortened URL slugs
- **Redirection**: Automatically redirect users from short URLs to original destinations
- **URL Validation**: Ensure submitted URLs are valid and accessible
- **Database Storage**: Persist all shortened URLs with metadata

### User Management
- **Account System**: Users can create accounts to manage their URLs
- **Personal Dashboard**: View and manage all URLs created by the user
- **URL Ownership**: Users can only modify URLs they've created

### Analytics & Monitoring
- **Visit Tracking**: Monitor how many times each shortened URL is accessed
- **Analytics Dashboard**: View popularity statistics and usage metrics
- **Rate Limiting**: Prevent abuse with intelligent rate limiting

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Copy to Clipboard**: Easy one-click copying of shortened URLs
- **Error Handling**: Clear error messages for invalid URLs or missing pages
- **404 Page**: Custom not found page for invalid slugs

## Technical Stack

- **Frontend**: Next.js with React and TypeScript
- **Backend**: NestJS RESTful API with TypeScript
- **Monorepo**: Turborepo for efficient build system and workspace management
- **Database**: PostgreSQL for persistent storage of URLs, users, and analytics
- **Containerization**: Docker support for easy deployment