# Security Route Tracking System ( Güvenliğim Nerede)

## Overview
The **Security Route Tracking System** is designed to monitor the routes taken by security personnel, ensuring that they visit designated checkpoints at specified intervals. This system helps supervisors verify that no locations are missed during security rounds.  

The application focuses on logging checkpoints visited, tracking timestamps, and ensuring compliance even in locations where GSM (cellular data) is unavailable.

---

## Features

### Security Guard App
- **Route Management**  
  - Start from the 0th point (ground level) and visit all 10 designated points located on different floors.

- **Check-in Options**  
  - **Location-Based Verification**  
    The app collects the user’s location and verifies it against the coordinates of the checkpoint. If the location doesn't match, the app prompts the user to go to the correct location.  
  - **Manual Check-in with Location Capture**  
    Personnel can press a button on the app at each checkpoint to log their visit. The app records their location and time of check-in for validation.

- **Offline Mode**  
  - Locations 6, 7, 10, and 11 are underground and lack cellular coverage. The app saves the check-ins offline and syncs them when a connection is available.

### Admin System
- **Check-in Monitoring**  
  Displays a real-time log of visited points, including timestamps and locations.

- **Compliance Verification**  
  Easily track missed points or delays in visiting checkpoints.

---

## Installation

### Prerequisites
- **For the App**  
  - Smartphone with GPS capabilities.  
  - Internet connection (required for areas with coverage).

- **For the Admin System**  
  - Web browser for accessing the admin dashboard.
