FROM debian:stretch

#Installation de curl
RUN apt update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

# Installation de Node.js
RUN curl -LO "https://nodejs.org/dist/v0.12.5/node-v0.12.5-linux-x64.tar.gz" \
&& tar -xzf node-v0.12.5-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v0.12.5-linux-x64.tar.gz

ADD server.js package.json /app/

WORKDIR /app/

# Install express
RUN npm install

EXPOSE 3000

CMD node server.js