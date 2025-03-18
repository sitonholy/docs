# FROM node:lts-alpine
# WORKDIR /build
# RUN npm config set sass_binary_site https://repo.huaweicloud.com/node-sass 
# RUN npm config set registry https://repo.huaweicloud.com/repository/npm/
# COPY / /build
# RUN  npm run build

FROM swr.cn-north-1.myhuaweicloud.com/guoyinglong/nginx:1.19.1-alpine
LABEL maintainer="guoyinglong@aiserver.cn"
COPY docs/.vuepress/dist /usr/share/nginx/html
