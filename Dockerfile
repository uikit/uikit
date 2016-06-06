FROM node

WORKDIR /uikit
RUN npm install --global gulp

CMD npm install && \
    gulp && \
    gulp sync

EXPOSE 3000
EXPOSE 3001
