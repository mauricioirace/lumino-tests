FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
ENV RIF_COMMS_BRANCH=grpc-api

# Installing basic packages
RUN apt-get update && \
	apt-get install -y build-essential zip unzip curl supervisor systemd wget curl lsof nano \
	software-properties-common unzip zip ssh git libcurl4 openssl liblzma5 tar && \
	rm -rf /var/lib/apt/lists/* && \
	rm -rf /tmp/*

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
RUN /bin/bash -c "source /root/.nvm/nvm.sh && nvm install v14.13 && npm config set user 0 && npm config set unsafe-perm true && npm install -g pm2"

# Installing rif-comms Node
RUN git clone https://github.com/rsksmart/rif-communications-pubsub-bootnode -b $RIF_COMMS_BRANCH /root/rif-communications-pubsub-bootnode
RUN rm -rf /root/rif-communications-pubsub-bootnode/config && mkdir /root/rif-communications-pubsub-bootnode/config
RUN /bin/bash -c "source /root/.nvm/nvm.sh && nvm use 14.13 && cd /root/rif-communications-pubsub-bootnode && npm install"
RUN mkdir /root/.rif-comms

# Copying assets
COPY assets/startRifComms /usr/local/bin/startRifComms
COPY assets/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY assets/server.json5 /root/rif-communications-pubsub-bootnode/config/server.json5
COPY assets/healthCheck /usr/local/bin/healthCheck
COPY assets/server.der /root/.rif-comms
COPY assets/server.pem /root/.rif-comms
RUN chmod +x /usr/local/bin/healthCheck

# RIF COMMS
EXPOSE 6010
# RIF COMMS WS
EXPOSE 6011
EXPOSE 6012

ENTRYPOINT ["/usr/bin/supervisord"]
