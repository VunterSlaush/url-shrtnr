# URL Shortener API

A RESTful API built with NestJS and TypeScript that provides URL shortening services, user management, and analytics tracking. This API serves as the backend for the URL Shortener application.

## Features

### Data Management
- [x] **PostgreSQL Integration**: Robust database operations with node-postgres

### Core API Endpoints
- [x] **URL Management**: Create, retrieve, update, and delete shortened URLs
- [x] **URL Redirection**: Handle redirection from short URLs to original destinations
- [x] **Custom Slugs**: Support for user-defined custom URL slugs
- [x] **URL Validation**: Server-side validation of submitted URLs
- [x] **Robust Slug Generation**: Automatic generation of unique, URL-safe slugs with collision detection
- [x] **API Tests**: Comprehensive unit and integration tests for all endpoints


### Authentication & Authorization
- [x] **JWT Authentication**: Secure token-based authentication system
- [x] **User Registration**: Account creation with OAuth GMail
- [x] **Protected Routes**: Secure endpoints requiring authentication
- [x] **User Session Management**: Handle login/logout and token refresh

### Analytics & Tracking
- [x] **Visit Analytics**: Track and store URL visit statistics
- [x] **Rate Limiting**: Implement intelligent rate limiting to prevent abuse
- [x] **Usage Metrics**: Collect data on URL usage patterns

## Technical Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with node-postgres
- **Authentication**: JWT tokens with OAuth2
- **API Documentation**: Swagger/OpenAPI
