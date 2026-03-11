# Smart Rail QR Park

A smart parking management system with QR code generation for railway stations.

## Features

- **QR Code Generation**: Generate QR codes for parking slots.
- **Parking Management**: Track parking slots and availability.
- **Receipt Generation**: Print parking receipts with QR codes.
- **Real-time Updates**: Live parking status monitoring.
- **Responsive Design**: Mobile-friendly interface.

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Spring Boot (Java), Maven
- **Database**: Supabase (PostgreSQL)
- **QR Generation**: QR code library integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Java 17 or higher
- Maven 3.6+
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd smart-rail-qr-park
   ```

2. **Install frontend dependencies**
   ```sh
   cd frontend
   npm install
   ```

3. **Set up backend**
   ```sh
   cd backend
   mvn clean install
   ```

4. **Configure Supabase**
   - Set up your Supabase project.
   - Update database connection in `backend/src/main/resources/application.properties`.
   - Run the migration scripts in `backend/db/sql/` using your preferred tool or Supabase dashboard.

### Running the Application

Start the backend server (in one terminal):

```sh
cd backend
mvn spring-boot:run
```

The backend server will run at: [http://localhost:3020](http://localhost:3020)

Start the frontend server (in another terminal):

```sh
cd frontend
npm run dev
```

The frontend will run at: [http://localhost:8020](http://localhost:8020)

Open your browser and navigate to [http://localhost:8020](http://localhost:8020) to use the application.

## Project Structure

```
smart-rail-qr-park/
├── backend/                        # Spring Boot backend
│   ├── src/main/java/com/smartparking/
│   │   ├── App.java                # Main application class
│   │   └── WelcomeController.java # REST API endpoints
│   ├── src/main/resources/
│   │   └── application.properties # Configuration
│   ├── db/sql/                    # SQL migration files
│   └── pom.xml                    # Maven dependencies
├── frontend/                      # React frontend with Vite
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── integrations/supabase/ # Supabase client integration
│   │   └── lib/                  # Utility functions
│   ├── package.json               # Frontend dependencies & scripts
│   └── tsconfig.json              # TypeScript config
├── backend/README.txt             # Backend-specific documentation
├── backend/db/README.txt          # Database-specific documentation
└── README.md                     # Project overview and instructions
```

## Backend Details

- Spring Boot application serves REST APIs for the Smart Rail QR Park project.
- Main entry point: `src/main/java/com/smartparking/App.java`.
- Sample API endpoint: `GET /api/welcome` (defined in `WelcomeController.java`).
- Default backend port: 3020 (configurable via `application.properties`).
- Backend uses Java 17+, Maven 3.6+ for build and dependency management.
- Configure database connection in `application.properties`.

## Database Details

- Database: Supabase (PostgreSQL).
- Migration scripts located in `backend/db/sql/`.
- Tables include `parking_slots` and `parking_records`.
- Frontend uses Supabase client for database operations.
- Backend can also connect to the database if needed.
- Sensitive keys should be kept secure and not committed to the frontend.
- For local development, manage schema via Supabase dashboard.

## Frontend Details

- Frontend built using React with TypeScript and Vite.
- Tailwind CSS and shadcn-ui are used for styling and UI components.
- Integrates with Supabase for real-time parking data.
- Frontend development server runs on port 8020 by default.
- Environment variables to configure:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

## API Endpoints

- `GET /api/welcome` - Welcome message endpoint.
- Additional endpoints for parking management (entry/exit, records, slots).

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test thoroughly.
5. Submit a pull request.


