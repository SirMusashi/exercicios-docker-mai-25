FROM nginx:1.27.5

    RUN rm -rf /etc/nginx/conf.d/*

    COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf 

    COPY ./material-kit-html /usr/share/nginx/html

    EXPOSE 80

    CMD ["nginx", "-g", "daemon off;"]