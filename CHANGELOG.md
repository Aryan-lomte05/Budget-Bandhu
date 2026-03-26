# Changelog - Dashboard UI Fixes

## Critical Fixes

### 1. Unblocked UI Interactions
- **Issue:** Users could not click "Upcoming Bills" arrows or "Pay Now" button.
- **Cause:** The `Logo3D` component overlay (Canvas) was capturing all pointer events because it covers the full screen.
- **Fix:** Applied `pointer-events: none` to the 3D Canvas element. This allows clicks to pass through to the underlying UI components.

### 2. Pig Mascot Fallback
- **Issue:** The 3D Pig mascot was often missing or took too long to load.
- **Cause:** The `public/logo.glb` file is **90MB**, causing timeouts.
- **Fix:** Implemented a visual fallback using `piggy-bank-logo.png`. The 2D image is displayed immediately while the 3D model loads in the background.

## Technical Debt / Warnings

> [!WARNING]
> **Large Asset Size**
> `public/logo.glb` is currently **90MB**.
> This is affecting load performance significantly. 
> **Action Item:** Compress this file to <5MB using gltf-pipeline or similar tools.
