# FROM node:16-alpine as module-install-stage
# # set working directory
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN apk add python3 make g++
# # Set environment variable for Python
# ENV PYTHON /usr/bin/python3
# RUN yarn
# RUN rm -rf tsconfig.build.tsbuildinfo


# # build
# FROM node:16-alpine as build-stage
# COPY --from=module-install-stage /app/node_modules/ /app/node_modules
# WORKDIR /app
# COPY . .
# RUN yarn build


# FROM node:16-alpine

# WORKDIR /build
# COPY --from=build-stage /app/dist .
# CMD [ "node", "./dist/main.js" ]



###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine AS development
# RUN npm install -g pnpm
# RUN apk add python3 make g++
# # Set environment variable for Python
# ENV PYTHON /usr/bin/python3

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

COPY --chown=node:node . .
RUN yarn

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine As build
WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]







# FROM node:16-alpine AS dist
# COPY package.json yarn.lock ./

# RUN yarn install

# RUN rm -rf tsconfig.build.tsbuildinfo

# COPY . ./

# RUN yarn build

# RUN rm -rf tsconfig.build.tsbuildinfo

# FROM node:16-alpine AS node_modules
# COPY package.json yarn.lock ./

# RUN yarn install --prod --network-timeout 1000000

# FROM node:16-alpine

# ARG PORT=3000

# RUN mkdir -p /usr/src/app

# WORKDIR /usr/src/app

# COPY --from=dist dist /usr/src/app/dist
# COPY --from=node_modules node_modules /usr/src/app/node_modules

# COPY . /usr/src/app

# EXPOSE $PORT

# CMD [ "yarn", "start:prod" ]
