# Approved Requests - Prefilled Data Fix - Test Guide

## Summary of Changes

### Backend Changes (MachineRequestService)
- **Auto-apply on approval**: When Chief Manager approves a request, machine data is automatically updated:
  - **TRANSFER**: Machine's location is updated to the requested garment
  - **PURCHASE**: A new machine is created with:
    - Location = requested garment
    - Type = machine type from request
    - Date = today's date
    - Machine ID auto-generated

### Frontend Changes (EditMachine.js)
- Changed fetch endpoint from `/api/machines/{id}` to `/api/machines/code/{machineCode}`
- Now stores the database ID when fetching machine
- Uses database ID for PUT updates

## Test Scenario 1: TRANSFER REQUEST

### Step 1: Create a Transfer Request (as Technician)
1. Login: `technician@concord.com / Tech@123`
2. Navigate to **Dashboard** → Create new transfer request
3. Fill details:
   - Machine ID: Select an existing machine (e.g., MAC-9047)
   - From Store: (auto-filled from machine's current location)
   - To Garment: Select a garment (e.g., GAR-001)
   - Priority: Medium
   - Reason: Test transfer
   - Date: Select a date
   - Click Submit

### Step 2: Approve Transfer Request (as Chief Manager)
1. Logout, then login: `chiefmanager@concord.com / Chief@123`
2. Navigate to **Approved Requests** section (or wherever requests are displayed)
3. Find your newly created transfer request
4. Click **Approve** button
5. **EXPECTED**: Machine location should update to the garment in the request

### Step 3: Verify Prefilled Data (as Admin)
1. Logout, then login: `admin@concord.com / Admin@123`
2. Navigate to **Approved Requests** → **Transfer Requests** tab
3. Click **Edit Machine** button on the approved transfer request
4. **EXPECTED**: Form should show:
   - Machine ID: MAC-9047 (or the machine you selected)
   - Type: (the machine's type)
   - Brand: (the machine's brand)
   - Model: (the machine's model)
   - Serial Number: (the machine's serial)
   - Location: **GAR-001** (should be the NEW garment, not the old store)
   - Added Date: (the machine's date)

### Step 4: Edit and Verify Updates
1. Change any field (e.g., update the Brand)
2. Click **Update Machine**
3. **EXPECTED**: 
   - Toast message: "Machine updated successfully!"
   - Changes persist when viewing the machine again

---

## Test Scenario 2: PURCHASE REQUEST

### Step 1: Create a Purchase Request (as Technician)
1. Login: `technician@concord.com / Tech@123`
2. Navigate to create new purchase request
3. Fill details:
   - Machine Type: Single Needle (or select from dropdown)
   - To Garment: Select a garment (e.g., GAR-002)
   - Priority: High
   - Reason: New machine purchase
   - Date: Select a date
   - Leave Machine ID empty (this is a new purchase)
   - Click Submit

### Step 2: Approve Purchase Request (as Chief Manager)
1. Logout, then login: `chiefmanager@concord.com / Chief@123`
2. Find and approve the purchase request
3. **EXPECTED**: A new machine should be created with:
   - Location: GAR-002 (the requested garment)
   - Type: Single Needle (the machine type from request)

### Step 3: Verify Prefilled Data (as Admin)
1. Logout, then login: `admin@concord.com / Admin@123`
2. Navigate to **Approved Requests** → **Purchase Requests** tab
3. Click **Add Machine** or **Edit Machine** button
4. **EXPECTED**: Form should show the newly created machine with:
   - Location: GAR-002 (the garment)
   - Type: Single Needle
   - Other fields can be filled by admin

---

## Troubleshooting

### Issue: "Failed to load machine (403)" Error
- **Cause**: Machine not found or fetch endpoint issue
- **Solution**: Verify the machineId format is correct (e.g., MAC-9047)
- **Check**: Ensure `/api/machines/code/{machineCode}` endpoint returns the machine

### Issue: Machine location not updated after approval
- **Cause**: Backend might need restart or request not actually approved
- **Solution**: 
  1. Verify the request status changed to "APPROVED"
  2. Restart the backend: `mvn spring-boot:run`
  3. Check server logs for errors

### Issue: Form shows empty when editing
- **Cause**: Machine ID might not be passed correctly or fetch failed silently
- **Solution**:
  1. Open browser DevTools (F12)
  2. Check Network tab - see if `/api/machines/code/{id}` call succeeded
  3. Check Console for any JavaScript errors

---

## Data Validation Checklist

✓ Machine location updates immediately on TRANSFER approval  
✓ New machine created on PURCHASE approval with correct garment location  
✓ Admin can view prefilled machine data  
✓ Admin can edit machine details  
✓ Updates to machine persist correctly  
✓ No errors in browser console  
✓ No 403/404 errors in network requests  

---

## Server URLs

- Frontend: http://localhost:3001
- Backend API: http://localhost:8080
- Backend Health: http://localhost:8080/actuator/health

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@concord.com | Admin@123 |
| Chief Manager | chiefmanager@concord.com | Chief@123 |
| Technician | technician@concord.com | Tech@123 |
