FROM node:22-bookworm

LABEL org.opencontainers.image.description "DOJ Forms Platform"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apt update && \
  apt install -y git

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# Use pnpm for dependency installation
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD [ "node", "./dist/index.js" ]

#HEALTHCHECK --interval=5m --timeout=3s \
#  CMD curl -f http://localhost:4321/ || exit 1
