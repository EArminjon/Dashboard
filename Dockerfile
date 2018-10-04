FROM debian:stretch

#Installation de curl
RUN apt update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

# Installation de Node.js
RUN curl -LO "https://nodejs.org/dist/v10.11.0/node-v10.11.0-linux-x64.tar.gz" \
&& tar -xzf node-v10.11.0-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v10.11.0-linux-x64.tar.gz

ADD ./node/server.js package.json /app/

WORKDIR /app/

# Install express
RUN npm install

EXPOSE 3000

CMD node server.js