FROM debian:stretch

#Installation de curl
RUN apt update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

# Installation de Node.js
RUN curl -LO "https://nodejs.org/dist/v10.11.0/node-v10.11.0-linux-x64.tar.gz" \
&& tar -xzf node-v10.11.0-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v10.11.0-linux-x64.tar.gz

ADD ./node/server.js ./node/route.js ./node/bdd.js ./node/communication.js package.json ./node/Service.js /app/
ADD ./node/widgets/weather.js ./node/widgets/weather_template.ejs /app/widgets/

WORKDIR /app/

# Install express
RUN npm install

EXPOSE 8080

CMD node server.js