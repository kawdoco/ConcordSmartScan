# Docker Troubleshooting Guide

## Current Issue: TLS Handshake Timeout

### Quick Fixes:

**1. Restart Docker Desktop**
```powershell
# Restart Docker service
Restart-Service docker
```

**2. Configure Docker DNS**
Open Docker Desktop → Settings → Docker Engine
Add this configuration:
```json
{
  "dns": ["8.8.8.8", "8.8.4.4"],
  "registry-mirrors": []
}
```
Click "Apply & Restart"

**3. Pull images manually (to test connectivity)**
```powershell
docker pull maven:3.9-eclipse-temurin-17
docker pull eclipse-temurin:17-jre
```

**4. Check Docker daemon**
```powershell
docker info
```

**5. If behind proxy/firewall:**
Docker Desktop → Settings → Resources → Proxies
Configure your proxy settings

**6. Alternative: Use WSL2 backend**
Docker Desktop → Settings → General
Enable "Use WSL 2 based engine"

**7. Check Windows Firewall**
```powershell
# Run as Administrator
Get-NetFirewallRule -DisplayName "*Docker*" | Select-Object DisplayName, Enabled
```

**8. Try different network**
- Switch to mobile hotspot
- Use VPN if corporate network is blocking

### If nothing works:
Build images without cache:
```powershell
docker-compose build --no-cache --pull
docker-compose up
```
