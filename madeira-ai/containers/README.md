# MADEIRA AI container images

These images are published to the Vercel Container Registry (VCR) and used as
reusable execution environments for Vercel Sandboxes. They do not replace the
existing Vercel Functions that serve the public API.

## Images

- `madeira-ai-node-runtime`: Node.js 24 Alpine with CA certificates, curl and
  tini. Intended for JavaScript/TypeScript automation and API-side tooling.
- `madeira-ai-python-worker`: Python 3.14 slim with CA certificates, curl and
  tini. Intended for research, source ingestion and report preparation.

Both images run as a non-root user, use a writable `/workspace` working
directory and include a minimal init process.

## Build and publish

The GitHub Actions workflow `.github/workflows/publish-madeira-containers.yml`
builds and pushes both images to VCR. It requires a GitHub Actions repository
secret named `VERCEL_TOKEN` with access to the MADEIRA AI Vercel project.

The workflow tags each image as `latest`. Pin the resolved image digest in
production Sandbox configuration after the first successful publish.

## Use in Vercel Sandbox

Pass the published VCR image reference to the Sandbox `image` option.
Sandbox starts the image filesystem; it does not run Docker ENTRYPOINT/CMD.
Start a process explicitly with `runCommand()` or the Sandbox command API.

Keep API keys and service credentials in Vercel environment variables or
Sandbox command environment injection. Never bake secrets into an image.
