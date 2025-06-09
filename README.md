# Team Member Management System

A full-stack application for managing team members, roles, and permissions.

## Project Structure

```
.
├── api/                 # Django REST API backend
│   ├── team_members/    # Team members app
│   ├── manage.py        # Django management script
│   └── requirements.txt # Python dependencies
└── spa/                # Angular frontend
    ├── src/            # Source code
    └── package.json    # Node dependencies
```

## Backend Setup (API)

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## Frontend Setup (SPA)

1. Navigate to the SPA directory:
   ```bash
   cd spa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:4200`

### Frontend Documentation

The SPA documentation can be generated and viewed using Compodoc:

```bash
# Generate and serve the documentation
npm run compodoc:build-and-serve
```

This will:
1. Generate comprehensive documentation for all components, services, and modules
2. Start a local server to view the documentation
3. Open the documentation in your default browser at `http://localhost:8080`

The documentation includes:
- Component documentation
- Service documentation
- Module documentation
- Routes documentation
- Dependency graphs
- Code coverage reports

## Running Tests

### Backend Tests

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Activate the virtual environment (if not already activated):
   ```bash
   # Windows
   .\venv\Scripts\activate

   # Linux/Mac
   source venv/bin/activate
   ```

3. Run the tests:
   ```bash
   # Run all tests
   python manage.py test

   # Run specific app tests
   python manage.py test team_members

   # Run with verbosity
   python manage.py test -v 2
   ```

### Frontend Tests

1. Navigate to the SPA directory:
   ```bash
   cd spa
   ```

2. Run the tests:
   ```bash
   # Run unit tests
   npm test

   # Run e2e tests
   npm run e2e
   ```

### End-to-End Testing with Cypress

To run Cypress e2e tests with a clean test database:

1. Set up the test database:
   ```bash
   # From the api directory
   cd api
   python setup_test_db.py
   ```

2. Start the API server with test database:
   ```bash
   # In one terminal
   export CYPRESS_TESTING=true  # For Linux/Mac
   # or
   set CYPRESS_TESTING=true     # For Windows
   python manage.py runserver
   ```

3. Run Cypress tests:
   ```bash
   # From the spa directory in another terminal
   cd spa
   npm run e2e
   ```

The test database will be automatically created with sample data for testing. This ensures that:
- Tests run against a consistent dataset
- Production data is not affected
- Tests are isolated and reproducible

## API Endpoints

- Team Members: `/api/team-members/`
- Roles: `/api/roles/`
- Permissions: `/api/permissions/`

## Development

### Backend Development

- The API is built with Django REST Framework
- Models are defined in `api/team_members/models.py`
- Views are defined in `api/team_members/views.py`
- URLs are configured in `api/team_members/urls.py`

### Frontend Development

- The frontend is built with Angular
- Components are in `spa/src/app/components/`
- Services are in `spa/src/app/core/services/`
- Store (state management) is in `spa/src/app/core/store/`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests to ensure everything works
4. Submit a pull request
