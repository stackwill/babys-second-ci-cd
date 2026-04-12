## Local development

Install dependencies and start the dev server:

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## What this app does

The home page posts plain text to `POST /api/base64`.
The route handler does the base64 encoding on the server with Node's `Buffer` API and returns JSON.

## Production build

```bash
bun run build
bun run start
```

## Docker

Build and run the production image locally:

```bash
docker build -t babys-second-ci-cd .
docker run --rm -p 3000:3000 babys-second-ci-cd
```

## GitHub Actions deployment

The workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) does this on every push to `main`:

1. Builds the Docker image.
2. Pushes the image to `ghcr.io`.
3. Copies `docker-compose.yml` to the Debian VM.
4. SSHes into the VM.
5. Writes a `.env` file with the image tag and port.
6. Runs `docker compose pull` and `docker compose up -d --force-recreate`.

### Repository variables

Set these in GitHub under `Settings -> Secrets and variables -> Actions -> Variables`:

- `DEPLOY_PATH`
  Example: `/opt/babys-second-ci-cd`
- `APP_PORT`
  Example: `3000`
- `CONTAINER_NAME`
  Example: `babys-second-ci-cd`
- `DEPLOY_PORT`
  Example: `22`

### Repository secrets

Set these in GitHub under `Settings -> Secrets and variables -> Actions -> Secrets`:

- `DEPLOY_HOST`
  Example: `147.28.123.177`
- `DEPLOY_USER`
  Example: `will`
- `DEPLOY_SSH_KEY`
  Private SSH key for the deploy user
- `GHCR_PULL_USERNAME`
  GitHub username used to pull private GHCR packages on the VM
- `GHCR_PULL_TOKEN`
  A classic personal access token with at least `read:packages`

If you make the GHCR package public, the last two secrets can be left empty and the server can pull anonymously.

### One-time VM setup

Make sure the remote user can run Docker and Docker Compose:

```bash
docker --version
docker compose version
id
```

If `docker compose version` fails, install the Docker Compose plugin before using this workflow.

Create the deploy directory once:

```bash
sudo mkdir -p /opt/babys-second-ci-cd
sudo chown -R "$USER":"$USER" /opt/babys-second-ci-cd
```

### Manual deploy logic

This is effectively what the workflow runs on the server:

```bash
cd /opt/babys-second-ci-cd
docker compose pull
docker compose up -d --force-recreate --remove-orphans
```

### Image tags

Each deploy pushes both:

- `latest`
- `sha-<commit-sha>`

The server deploy step uses the SHA tag so each rollout is tied to a specific commit.
