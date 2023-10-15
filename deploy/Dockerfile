FROM nginx:1.25.2
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY ./build .
#COPY deploy/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
