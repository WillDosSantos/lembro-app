# Contributor System

This document describes the contributor system implemented for Lembra memorial profiles.

## Overview

The contributor system allows profile owners to invite other users to help manage memorial profiles. Contributors can be assigned different roles with varying permissions.

## Features

### Roles
- **Editor**: Can edit all content, add photos, manage family information, and invite other contributors
- **Viewer**: Can only view the memorial and leave comments

### Permissions
- **Profile Owner**: Full control including deletion and contributor management
- **Editor Contributors**: Can edit content but cannot delete the profile or manage contributors
- **Viewer Contributors**: Read-only access

## API Endpoints

### GET `/api/profiles/[slug]/contributors`
- Fetches all contributors for a profile
- Requires authentication
- Only accessible by profile owner or existing contributors

### POST `/api/profiles/[slug]/contributors`
- Adds a new contributor invitation
- Sends email invitation automatically
- Only accessible by profile owner
- Body: `{ email: string, role: 'editor' | 'viewer' }`

### DELETE `/api/profiles/[slug]/contributors?email=...`
- Removes a contributor
- Only accessible by profile owner

### POST `/api/invitations/accept`
- Accepts a pending invitation
- Body: `{ profileSlug: string }`

## Email System

### Invitation Emails
- Sent automatically when a contributor is added
- Includes signup link and memorial link
- Beautiful HTML template with clear instructions
- Currently uses test email service (Ethereal Email)

### Email Template Features
- Responsive design
- Clear call-to-action buttons
- Role-specific instructions
- Professional branding

## UI Components

### ContributorManager
- Displays current contributors with their roles and status
- Add new contributor form
- Remove contributor functionality
- Pending invitation acceptance
- Real-time status updates

### Permission Checks
- Profile page: Shows edit button only for owners and editor contributors
- Edit page: Redirects unauthorized users
- API routes: Validates permissions on all operations

## Data Structure

### Contributor Object
```typescript
interface Contributor {
  email: string;
  role: 'editor' | 'viewer';
  invitedAt: string;
  acceptedAt?: string;
  invitedBy: string;
}
```

### Profile Updates
- Added `contributors` array to profile schema
- Maintains backward compatibility with existing profiles

## Security Considerations

- All API endpoints require authentication
- Permission checks on both client and server side
- Email validation for invitations
- Prevents self-invitation and duplicate invitations
- Only profile owners can manage contributors

## Future Enhancements

- Real email service integration (SendGrid, AWS SES)
- Email templates customization
- Bulk invitation system
- Contributor activity logging
- Advanced role permissions
- Invitation expiration dates
