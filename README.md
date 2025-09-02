# Miele Launderette Management System

A modern Angular application for managing laundry cycles in a self-service launderette. Built with Angular 20, featuring lazy-loaded modules, multi-select filtering, and responsive design.

## Overview

This application demonstrates modern Angular development patterns including feature modules with lazy loading, shared component architecture, and advanced filtering capabilities. Users can view existing laundry cycles and start new ones by selecting available devices.

## Architecture

The project follows a modular architecture with clear separation of concerns:

### Feature Modules
- **Cycles Module**: Lazy-loaded feature containing cycle management components
- **Shared Module**: Reusable components used across different features

### Component Architecture
- **Root App**: Standalone component handling routing and layout
- **Feature Components**: Module-based components for cycles functionality
- **Shared Components**: Multi-select filter component for cross-feature use

## Project Structure

```
src/app/
├── features/
│   └── cycles/
│       ├── cycles.module.ts
│       └── components/
│           ├── cycle-list/
│           │   ├── cycle-list.component.ts
│           │   ├── cycle-list.component.html
│           │   └── cycle-list.component.scss
│           └── new-cycle/
│               ├── new-cycle.component.ts
│               ├── new-cycle.component.html
│               └── new-cycle.component.scss
├── shared/
│   ├── shared.module.ts
│   └── components/
│       └── cycle-filter/
│           ├── cycle-filter.component.ts
│           ├── cycle-filter.component.html
│           └── cycle-filter.component.scss
├── models/
│   ├── enums.ts
│   ├── cycle.model.ts
│   ├── device.model.ts
│   ├── tariff.model.ts
│   └── index.ts
├── services/
│   └── api.service.ts
├── app.ts
├── app.html
├── app.scss
├── app.config.ts
└── app.routes.ts
```

## Key Features

### Advanced Filtering System
The filter component supports multiple selection modes:
- **Default**: Shows all cycles
- **Single Selection**: Filter by one status (e.g., only completed cycles)
- **Multi-Selection**: Filter by multiple statuses simultaneously
- **Live Counts**: Real-time count updates for each status category
- **Smart Logic**: Automatically switches between "Show All" and individual filters

### Cycle Management
- View all active and completed laundry cycles
- Start new cycles by selecting available devices
- End active cycles with one click
- View pricing and invoice details

### Responsive Design
- Works on desktop and mobile devices
- Clean Material Design interface
- Accessible UI components

## Technical Implementation

### Modern Angular Features
- Uses latest Angular 20 control flow syntax (`@for`, `@if`)
- TypeScript enums for type safety
- Reactive programming with RxJS
- Standalone and module-based component patterns

### State Management
- Reactive forms with validation
- Observable data streams
- Component communication via ViewChild and EventEmitter

### API Integration
- RESTful API consumption via HttpClient
- Error handling and loading states
- Real-time data updates

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the mock API server:
```bash
npx json-server backend-api.json
```

3. Start the development server:
```bash
npm start
```

4. Open browser to `http://localhost:4200`

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## API Endpoints

The application consumes these REST endpoints:
- `GET /cycles` - Retrieve all cycles
- `POST /cycles` - Create new cycle
- `PATCH /cycles/:id` - Update cycle (end cycle)
- `GET /devices` - Retrieve available devices
- `GET /tariffs` - Retrieve pricing information

## Implementation Notes

### Module Strategy
I chose to implement a mixed architecture showcasing both standalone components (root app) and traditional NgModule components (features). This demonstrates flexibility with Angular's component patterns and understanding of when to use each approach.

### Filtering Logic
The multi-select filter uses state management to handle various selection combinations while maintaining intuitive UX. The component manages mutual exclusivity between "Show All" and individual status selections.

### Type Safety
Implemented comprehensive TypeScript interfaces with enums for status and device types, ensuring compile-time safety and better developer experience.

### Performance Considerations
- Lazy loading reduces initial bundle size
- TrackBy functions optimize list rendering
- OnPush change detection could be added for further optimization

## Assumptions

- Device availability is determined by checking for active cycles
- User agent is automatically captured for new cycles
- Invoice lines are populated by the backend system
- The mock API simulates real backend behavior using json-server

## Future Enhancements

Given more time, I would consider adding:
- User authentication and session management
- Real-time WebSocket updates for cycle status changes
- Advanced analytics and reporting features
- Payment integration
- Push notifications for cycle completion
- Offline support with service workers

## Technology Stack

- Angular 20 with latest control flow syntax
- Angular Material for UI components
- RxJS for reactive programming
- TypeScript with strict type checking
- SCSS for component styling
- json-server for API mocking
- Jasmine and Karma for testing