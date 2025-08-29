# URL Shortener Web App

A modern React-based frontend application for the URL Shortener service. Built with Next.js and TypeScript, providing a responsive and user-friendly interface for creating and managing shortened URLs.

## Features

### Core User Interface
- [x] **URL Shortening Form**: Clean, intuitive interface for submitting URLs to shorten
- [x] **Custom Slug Input**: Allow users to specify custom URL slugs
- [x] **Copy to Clipboard**: One-click copying of generated short URLs
- [x] **URL Validation**: Real-time client-side URL validation with user feedback

### User Dashboard
- [ ] **Personal URL Management**: View and manage all user-created URLs
- [ ] **URL Analytics**: Display visit counts and usage statistics
- [ ] **Edit/Delete URLs**: Modify or remove existing shortened URLs
- [ ] **Search and Filter**: Find specific URLs in user's collection

### Authentication Interface
- [ ] **Login/Register Forms**: Clean authentication interfaces
- [ ] **OAuth Integration**: Google Sign-In integration
- [ ] **Protected Routes**: Secure pages requiring authentication

### User Experience
- [ ] **Responsive Design**: Mobile-first design that works on all devices
- [ ] **Error Handling**: User-friendly error messages and validation feedback
- [ ] **Loading States**: Smooth loading indicators during API calls
- [x] **404 Page**: Custom not found page for invalid routes
- [x] **Toast Notifications**: Success and error notifications

## Technical Stack

- **Framework**: Next.js with React and TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks and context for local state
- **HTTP Client**: Axios for backend communication
- **Authentication**: JWT token management
- **Routing**: Next.js App Router for navigation
