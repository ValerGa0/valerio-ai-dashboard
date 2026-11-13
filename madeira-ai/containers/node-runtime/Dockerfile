FROM node:24-alpine

RUN apk add --no-cache ca-certificates curl tini \
  && addgroup -S madeira \
  && adduser -S madeira -G madeira

WORKDIR /workspace
ENV NODE_ENV=production
ENV HOME=/home/madeira

USER madeira
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--version"]
