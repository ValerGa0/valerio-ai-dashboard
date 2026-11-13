FROM python:3.14-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl tini \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system madeira \
  && useradd --system --gid madeira --create-home madeira

WORKDIR /workspace
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV HOME=/home/madeira

USER madeira
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["python", "--version"]
