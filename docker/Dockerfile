FROM node:14.15-alpine

RUN apk add --no-cache bash curl git shadow

ENV GOSU_VERSION 1.10
RUN curl -sS -Lo /usr/bin/gosu https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-amd64
RUN chmod +x /usr/bin/gosu

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV GIST_URL https://gist.githubusercontent.com/LucasVmigotto/c9e335f85acb9bc27f0504563419a80a/raw/0d933d37842a55853c95f9ddd80b7edc4b6f7e78/entrypoint.sh
RUN curl -sS $GIST_URL > /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

RUN yarn global add @angular/cli

VOLUME /app
WORKDIR /app

ENTRYPOINT [ "/usr/bin/entrypoint.sh" ]
CMD [ node ]
