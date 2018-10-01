FROM debian:stretch

# RUN apt update && apt install -y curl software-properties-common \
# && curl -sL https://deb.nodesource.com/setup_10.x | bash -
# # && apt-get install -y nodejs

#Installation de curl avec apt-get
RUN apt update \
&& apt-get install -y curl \
&& rm -rf /var/lib/apt/lists/*

# Installation de Node.js à partir du site officiel
RUN curl -LO "https://nodejs.org/dist/v0.12.5/node-v0.12.5-linux-x64.tar.gz" \
&& tar -xzf node-v0.12.5-linux-x64.tar.gz -C /usr/local --strip-components=1 \
&& rm node-v0.12.5-linux-x64.tar.gz

ADD server.js /app/

WORKDIR /app

EXPOSE 3000

CMD node server.js