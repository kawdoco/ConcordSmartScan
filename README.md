# ConcordSmartScan

> Enterprise Application Development - Group B
> Automating Asset Recovery and Allocation for the Garment Industry

## Project Overview
ConcordSmartScan is an enterprise solution designed to reduce production downtime in garment factories.

When a sewing machine fails, finding a replacement manually across multiple stores can delay production. This system improves that process by helping teams identify and allocate available machines faster.

## Project Structure

```text
ConcordSmartScan/
|-- src/
|   |-- backend/   # Spring Boot API
|   `-- frontend/  # React application
|-- docker-compose.yml
`-- README.md
```

## Setup and Run Project

### 1. Clone the project from dev branch

```powershell
git clone -b dev <repository-url>
cd ConcordSmartScan
```

If you already cloned the repository and need to switch:

```powershell
git checkout dev
git pull origin dev
```

### 2. Prerequisites

Before starting setup, make sure these are already installed on your machine:

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL
- pgAdmin 4

### 3. Set up PostgreSQL and pgAdmin

Backend database config is in src/backend/src/main/resources/application.properties and expects:

- Host: localhost
- Port: 5432
- Database: concord_db
- Username: postgres
- Password: postgres

Add the PostgreSQL server in pgAdmin:

1. Open pgAdmin.
2. In Object Explorer, right-click Servers and select Register > Server.
3. In General tab, enter any server name.
4. In Connection tab, use Host: localhost, Port: 5432, Username: postgres, Password: postgres.
5. Save the server.

<img src="docs/pgadmin-add-server.png" alt="Register server in pgAdmin" width="50%" />
<img src="docs/pgadmin-server-connection.png" alt="pgAdmin server connection tab with localhost and postgres credentials" width="50%" />

Create the project database in pgAdmin:

1. Expand your registered server.
2. Right-click Databases and select Create > Database.
3. Set Database name to concord_db.
4. Keep Owner as postgres, then save.

<img src="docs/pgadmin-create-database.png" alt="Create concord_db database in pgAdmin" width="50%" />

Before running the backend, ensure PostgreSQL service is running and credentials match the values above.

Reference (pgAdmin and database connection):
https://youtu.be/WFT5MaZN6g4?si=1bB8h45fQ8TcCKwr

### 4. Run backend and frontend in two terminals

Open two terminal windows.

Terminal 1 (Backend):

```powershell
cd src/backend
run-backend.bat
```

<img src="docs/backend-terminal-run.png" alt="Backend terminal running run-backend.bat" width="50%" />

Terminal 2 (Frontend):

```powershell
cd src/frontend
run-frontend.bat
```

<img src="docs/frontend-terminal-run.png" alt="Frontend terminal running run-frontend.bat" width="50%" />

### 5. Access the application

- Frontend: http://localhost:3000 (will open in browser once the project is up and running)
- Backend: http://localhost:8080 (for testing APIs if needed)

Do not close the terminals while project is running. 
To top running use below, in each terminal: 

```powershell
ctrl+c
``` 

Check if tables are created in pgAdmin at:

Server > Your_Server_Name > Databases > concord_db > Schemas > Public > Tables

Check if Admin details are in user table:

Right Click users -> View/Edit Data -> All Rows 

## Technologies Used

### Frontend
- React
- Axios
- Node.js

### Backend
- Spring Boot
- Java
- Maven
- Spring Data JPA

### Database and Management
- PostgreSQL
- pgAdmin 4

