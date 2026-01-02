# Plan: Add nom-nom-tracker support to xo-nginx

This plan outlines the steps to integrate the `nom-nom-tracker` application into the `xo-nginx` reverse proxy.

## 1. Update `nom-nom-tracker` Docker Configuration
- Modify `nom-nom-tracker/docker-compose.yml` to:
    - Define `app-network` as an external network.
    - Connect `backend` and `frontend` services to `app-network`.
    - Update `REACT_APP_API_URL` for the frontend to point to the proxied path `/nom-nom`.

## 2. Create Nginx Configuration for `nom-nom-tracker`
- Create `xo-nginx/conf.d/nom-nom.conf` with:
    - Upstream definitions for `nom-nom-frontend` and `nom-nom-backend`.
    - Location block for `/nom-nom/` (frontend).
    - Location block for `/nom-nom/api/` (backend) with path rewriting.
    - Health check endpoint for `nom-nom-tracker`.

## 3. Verification
- Ensure `xo-nginx` can resolve `nom-nom-frontend` and `nom-nom-backend` on the `app-network`.
- Verify that the frontend is accessible at `/nom-nom/`.
- Verify that API calls are correctly routed to the backend.
