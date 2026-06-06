# ConcordSmartScan

> Enterprise Application Development - Group B
> Automating Asset Recovery and Allocation for the Garment Industry

## Project Overview
ConcordSmartScan is an enterprise solution designed to reduce production downtime in garment factories.

When a sewing machine fails, finding a replacement manually across multiple stores can delay production. This system improves that process by helping teams identify and allocate available machines faster.

## ConcordSmartScan Team

Contributors (replace the GitHub placeholders with real usernames):

- [Nirmalie Perera](https://github.com/NirmaliePerera) - Project Lead, UI Design, Frontend, Backend, QA
- [Buddika Prabhath](https://github.com/buddikaprabath) - Second Lead, Project initiation, Database Configuration, Frontend, Backend
- [Tharushi Sandeepani](https://github.com/TharushiSandeepani) - Frontend, Backend, QA Lead
- [Imal Udyog](https://github.com/imaludyog) - Frontend, Backend
- [Prasansa Nawanjalee](https://github.com/Nawanjalee) - Frontend, Backend
- [Malki Perera](https://github.com/Malki14) - UI Lead Design, Frontend, Backend, 
- [Rashmi Fernando](https://github.com/RashmiFernando99) - Frontend
- [Kavindu Pansilu](https://github.com/kavindupansilu) - Frontend
- [Nuwan Senevirathna](https://github.com/nuwansenevirathna) - Frontend
- [Rayani Fernando](https://github.com/RayaniMaleesha) - Frontend, Testing
- [Nimna Fernando](https://github.com/NimnaDevindi99) - Frontend



<table>
	<tr>
		<td><img src="docs/References_for_README/Presentation-Day.jpeg" alt="Photo 1" style="height:220px; width:auto;"/></td>
		<td><img src="docs/References_for_README/Group-B-ConcordSmartScan.jpeg" alt="Photo 2" style="height:220px; width:auto;"/></td>
	</tr>
	<tr>
		<td align="center">Presentation Day</td>
		<td align="center">Group B ConcordSmartScan</td>
	</tr>
</table>

## Project Structure

```text
ConcordSmartScan/
|-- src/
|   |-- backend/   # Spring Boot API
|   `-- frontend/  # React application
|-- docker-compose.yml
`-- README.md
```

## Run with Docker (recommended)

From the project root:

```powershell
docker compose up --build
```

To include pgAdmin (optional):

```powershell
docker compose --profile tools up --build
```

Access:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- pgAdmin (optional): http://localhost:5050

pgAdmin connection details (inside Docker):

- Host: db
- Port: 5432
- Database: concord_db
- Username: postgres
- Password: postgres

Stop services:

```powershell
docker compose down
```

To remove volumes and reset data:

```powershell
docker compose down -v
```

Local overrides: this repo includes docker-compose.override.yml which is auto-loaded by Docker Compose. It maps host ports to 3001/8081/5433/5051 and updates the frontend API URL to http://localhost:8081.

Migrations:

- Flyway is enabled to track migrations (baseline only for now; schema is still created by Hibernate).

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

Only needed if you are running without Docker.

Before starting setup, make sure these are already installed on your machine:

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL
- pgAdmin 4

### 3. Set up PostgreSQL and pgAdmin

Skip this section if you are using Docker with the pgAdmin profile.

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

<img src="./docs/References_for_README/pgadmin-add-server.png" alt="Register server in pgAdmin" width="50%" style="background:#fff; border:1px solid #444; box-shadow:0 4px 10px rgba(0,0,0,0.25); padding:4px;" />
<img src="./docs/References_for_README/pgadmin-server-connection.png" alt="pgAdmin server connection tab with localhost and postgres credentials" width="50%" style="background:#fff; border:1px solid #444; box-shadow:0 4px 10px rgba(0,0,0,0.25); padding:4px;" />

Create the project database in pgAdmin:

1. Expand your registered server.
2. Right-click Databases and select Create > Database.
3. Set Database name to concord_db.
4. Keep Owner as postgres, then save.

<img src="./docs/References_for_README/pgadmin-create-database.png" alt="Create concord_db database in pgAdmin" width="50%" style="background:#fff; border:1px solid #444; box-shadow:0 4px 10px rgba(0,0,0,0.25); padding:4px;" />

Before running the backend, ensure the PostgreSQL service is running, and credentials match the values above.

Reference (pgAdmin and database connection):
https://youtu.be/WFT5MaZN6g4?si=1bB8h45fQ8TcCKwr

### 4. Run backend and frontend in two terminals

Open two terminal windows.

Terminal 1 (Backend):

```powershell
cd src/backend
run-backend.bat
```

<img src="./docs/References_for_README/backend-terminal-run.png" alt="Backend terminal running run-backend.bat" width="50%" style="background:#fff; border:1px solid #444; box-shadow:0 4px 10px rgba(0,0,0,0.25); padding:4px;" />

Terminal 2 (Frontend):

```powershell
cd src/frontend
run-frontend.bat
```

<img src="./docs/References_for_README/frontend-terminal-run.png" alt="Frontend terminal running run-frontend.bat" width="50%" style="background:#fff; border:1px solid #444; box-shadow:0 4px 10px rgba(0,0,0,0.25); padding:4px;" />

### 5. Access the application

- Frontend: http://localhost:3000 (will open in browser once the project is up and running)
- Backend: http://localhost:8080 (for testing APIs if needed)

First page shown on opening the frontend:

<img src="./docs/References_for_README/login-page.png" alt="Login page shown first when opening frontend" width="50%" style="background:#fff; border:1px solid #444; box-shadow:0 4px 10px rgba(0,0,0,0.25); padding:4px;" />

Do not close the terminals while the project is running. 
To top running use below, in each terminal: 

```powershell
ctrl+c
``` 

Check if tables are created in pgAdmin at:

```Server > Your_Server_Name > Databases > concord_db > Schemas > Public > Tables
```

Check if Admin details are in user table:

```Right Click users -> View/Edit Data -> All Rows 
```

Seed Admin login details are initialized in:

```src/backend/src/main/java/com/example/backend/config/DataInitializer.java
```

Default seed Admin credentials:

- Email: admin@concord.com
- Password: Admin@123

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

