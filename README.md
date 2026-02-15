# ConcordSmartScan

> **Enterprise Application Development - Group B**
> *Automating Asset Recovery & Allocation for the Garment Industry*

## 📌 Project Overview
**ConCordSmartScan** is an enterprise resource solution designed to minimize production downtime in garment factories. 

When industrial sewing machines fail, manual searches for replacements across scattered store locations cause significant delays and financial loss. This system automates the discovery process, allowing supervisors to instantly locate the nearest available replacement machine using QR code identification and geospatial logic.

## 🏗️ Project Structure

```
group_project/
├── src/
│   ├── frontend/          # React application
│   │   ├── public/
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── backend/           # Spring Boot application
│       ├── src/
│       │   └── main/
│       │       ├── java/
│       │       └── resources/
│       ├── pom.xml
│       └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started with Docker

### Prerequisites

- Docker Desktop installed
- Docker Compose installed

### Running with Docker Compose

1. Build and start all services:
```bash
docker-compose up --build
```

2. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api/hello

3. Stop the services:
```bash
docker-compose down
```

### Running Services Individually

#### Frontend (React)
```bash
cd src/frontend
npm install
npm start
```

#### Backend (Spring Boot)
```bash
cd src/backend
mvn clean install
mvn spring-boot:run
```

## 🛠️ Technologies Used

### Frontend
- React 18
- Axios for API calls
- Node.js 18

### Backend
- Spring Boot 3.2.0
- Java 17
- Maven
- H2 Database (in-memory)
- Spring Data JPA

### DevOps
- Docker
- Docker Compose

## 📡 API Endpoints

- `GET /api/hello` - Test endpoint that returns a greeting message

## 🐳 Docker Commands

Build images:
```bash
docker-compose build
```

Start services in detached mode:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

Stop and remove containers:
```bash
docker-compose down
```

Remove volumes:
```bash
docker-compose down -v
```

