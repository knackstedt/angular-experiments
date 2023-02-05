FROM nginx:1.23.1-alpine

RUN apk update
RUN apk add --no-cache nodejs npm

# RUN apt update
# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
# RUN apt install nodejs -y

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

WORKDIR /app/

COPY dist/client .


EXPOSE 80