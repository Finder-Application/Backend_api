
# ###################
# # BUILD FOR LOCAL DEVELOPMENT
# ###################

# FROM --platform=linux/amd64 node:16-alpine AS development
# RUN npm install -g pnpm
# # RUN apk add python3 make g++
# # # Set environment variable for Python
# # ENV PYTHON /usr/bin/python3

# WORKDIR /usr/src/app

# COPY --chown=node:node pnpm-lock.yaml ./

# RUN pnpm fetch --prod

# COPY --chown=node:node . .
# RUN pnpm install

# USER node

# ###################
# # BUILD FOR PRODUCTION
# ###################

# FROM --platform=linux/amd64 node:16-alpine As build
# WORKDIR /usr/src/app

# COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# COPY --chown=node:node . .

# RUN npm run build

# ENV NODE_ENV production

# USER node

# ###################
# # PRODUCTION
# ###################

# FROM --platform=linux/amd64 node:16-alpine As production

# COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
# COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# CMD [ "node", "dist/main.js" ]





###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM --platform=linux/amd64 node:16-alpine As development
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM --platform=linux/amd64 node:16-alpine As build
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN pnpm build

ENV NODE_ENV production

RUN pnpm install --prod

USER node

###################
# PRODUCTION
###################

FROM --platform=linux/amd64 node:16-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]

