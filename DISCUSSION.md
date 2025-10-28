# Kyle Curren - Technical Assessment

## Project Overview

While the initial requirement was to build a search interface for advocates with a suggested 2-hour timeframe, I felt it necessary to extend beyond this to deliver the beginings of an advocate management system. In a real product environment, anything that is user-facing should also support the operational workflows behind it. Implementing both sides — search for patients and management for administrators — allowed me to better demonstrate full-stack capabilities, thoughtful architecture, and a holistic product mindset.

## Technical Implementation

### Database Architecture Redesign

The original implementation stored advocate specialties as JSON arrays in a `payload` column. This approach had several limitations:

**Before (Denormalized):**

```javascript
advocate.payload = ["Bipolar", "PTSD", "Trauma"]  // JSONB field
```

**After (Normalized):**

```text
advocates ← advocate_specialties → specialties
```

This normalization provides:

- Efficient querying capabilities with proper indexing
- Data integrity through foreign key constraints
- Foundation for specialty management features
- Significantly improved performance at scale

### Performance Optimization

I identified and resolved a critical N+1 query problem in the advocates GET endpoint:

**Original:**

- 1 query to fetch all advocates
- N queries to fetch specialties for each advocate
- Result: 16 database calls for 15 advocates

**Solution:**

- Single query using LEFT JOINs
- More consistent performance while the data size grows

### Component Architecture

To ensure maintainability and reusability, I created:

- **`AdvocateSearchInput`** - Reusable search component used across multiple pages
- **`filterAdvocates`** - Centralized filtering logic ensuring consistency
- **`AdvocateDialog`** - Unified interface for both create and edit operations
- **Layout Components** - Header and Footer for consistent application structure

This approach eliminates code duplication and provides a consistent user experience throughout the application.

### Implementation Journey

The project evolved through several stages:

1. **Initial Database Integration** - Migrated from static data to PostgreSQL, fixing container configuration issues along the way
2. **React Best Practices** - Fixed missing key props, replaced DOM manipulation with proper React state management
3. **User Experience Enhancements** - Added loading states, error handling, phone number formatting, and specialty badges
4. **Full CRUD Implementation** - Extended beyond search to complete advocate management capabilities

### Migration and Seeding Strategy

I created migrations to handle the database normalization from the JSONB payload column to a proper many-to-many relationship between advocates and specialties. This included:

- **`0001_migrate_specialties.sql`** - Creates the `specialties` and `advocate_specialties` tables, establishes foreign key relationships, and migrates existing specialty data from the JSONB payload
- **`0002_drop_payload_column.sql`** - Removes the deprecated payload column after data migration

Discovered that manually created migrations weren't being tracked by Drizzle's journal system, so I:

- Updated `_journal.json` to properly track all migrations
- Modified the seed function to check for existing specialties
- Enhanced seed data generation to assign 2-10 specialties per advocate
- Ensured all operations are safe to run multiple times or from a fresh environment

## Future Development Roadmap

### Phase 1: Enhanced Search Capabilities

- **Fuzzy search or type ahead system** to help users find what they are looking for
- **Multi-select specialty filtering** for limiting results to a set of specialties
- **Range slider for experience** for limiting results to a range of years of experience
- **Geographic search** using ZIP codes with configurable radius if applicable. (onsite visits are desired)
- **Server-side filtering and pagination** for scalability

- **Technical Architecture Improvements**
  - Service layer separation for business logic for the api
  - API interation abstract for the frontend via services
  - Custom error pages and improved error handling

### Phase 2: Administrative Features

- **Authentication & Authorization**
  - Role-based access control (Admin, Manager, Viewer)
  - Granular permissions system
  - Comprehensive audit logging

- **Specialty Management Interface**
  - Full CRUD operations for specialties
  - Usage analytics and reporting
  - Bulk import/export capabilities
  
- **Enhanced Data Model**
  - Separate degrees table supporting multiple degrees per advocate
  - Certification tracking with expiration dates
  - Availability and scheduling integration

### Phase 3: Advanced Features

- **AI-Powered Advocate Matching**
  - Natural language processing for patient queries
  - Intelligent recommendation engine
  - Guided questionnaire for optimal matches

## Technical Decisions and Learnings

### Key Insights

1. **Database Design**: The migration from JSONB to normalized tables was essential for long-term maintainability and performance.

2. **TypeScript Challenges**: Resolved type safety issues with Drizzle ORM using non-null assertions after proper validation.

3. **Performance**: Disconvered N+1 query while updating advocate route with CRUD opperations

## Development Philosophy

I believe in building software that serves both immediate needs and future growth. While I could have delivered a basic search interface within the suggested timeframe, I chose to demonstrate:

- **Full-stack capabilities** from database design to UI implementation
- **Performance-first mindset** with the future at the forefront
- **Strategic thinking** about product evolution and scaling
- **Code quality** that enables team collaboration and maintenance

This approach reflects how I work on real projects - considering the complete ecosystem rather than just fulfilling minimum requirements. The additional time invested demonstrates my commitment to delivering solutions that provide lasting value.
