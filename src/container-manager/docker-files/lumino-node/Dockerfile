FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
ENV LUMINO_BRANCH=develop
ENV RIF_COMMS_BRANCH=grpc-api
ENV NODE_PORT=5001
ENV NETWORK_ID=33
ENV RSK_ENDPOINT="http://rsk-node:4444"
ENV PYTHON_VERSION=3.7.3

# Installing basic packages
RUN apt-get update && \
	apt-get install -y build-essential zip unzip curl supervisor systemd wget curl lsof nano \
	software-properties-common unzip zip ssh git libcurl4 openssl liblzma5 tar
RUN apt-get install -y libsecp256k1-dev libssl-dev automake pkg-config libtool libffi-dev libgmp-dev libyaml-cpp-dev \
	libreadline-gplv2-dev libncursesw5-dev libssl-dev \
    libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev && \
	rm -rf /var/lib/apt/lists/* && \
	rm -rf /tmp/*

RUN cd /usr/src && wget https://www.python.org/ftp/python/$PYTHON_VERSION/Python-$PYTHON_VERSION.tgz \
    && tar xzf Python-$PYTHON_VERSION.tgz && cd Python-$PYTHON_VERSION && ./configure --enable-optimizations && make altinstall

RUN update-alternatives --install /usr/local/bin/python python /usr/local/bin/python3.7 0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
RUN /bin/bash -c "source /root/.nvm/nvm.sh && nvm install v14.13 && npm config set user 0 && npm config set unsafe-perm true && npm install -g pm2"

# installing truffle
RUN /bin/bash -c "source /root/.nvm/nvm.sh && nvm use 14.13 && npm i -g truffle"

# installing geth
RUN wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.8.23-c9427004.tar.gz
RUN tar -zxf geth-linux-amd64-1.8.23-c9427004.tar.gz
RUN mv geth-linux-amd64-1.8.23-c9427004/geth /usr/local/bin/geth

# Installing rif-comms Node
RUN git clone https://github.com/rsksmart/rif-communications-pubsub-bootnode -b $RIF_COMMS_BRANCH /root/rif-communications-pubsub-bootnode
RUN rm -rf /root/rif-communications-pubsub-bootnode/config && mkdir /root/rif-communications-pubsub-bootnode/config
RUN /bin/bash -c "source /root/.nvm/nvm.sh && nvm use 14.13 && cd /root/rif-communications-pubsub-bootnode && npm install"

# Installing Lumino Node
RUN git clone https://github.com/rsksmart/lumino.git -b $LUMINO_BRANCH /root/lumino
COPY assets/startLumino /root/lumino
COPY assets/createEnvironment /root/lumino
COPY assets/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN chmod +x /root/lumino/createEnvironment
RUN chmod +x /root/lumino/startLumino
RUN cd /root/lumino && ./createEnvironment

COPY assets/generateKey /usr/local/bin/generateKey
COPY assets/createAccounts /usr/local/bin/createAccounts
COPY assets/fundAccounts /usr/local/bin/fundAccounts
COPY assets/server.json5 /root/rif-communications-pubsub-bootnode/config/server.json5
COPY assets/fundAccountsWithToken /usr/local/bin/fundAccountsWithToken
COPY assets/lumino-docker-fix.py /root/lumino/raiden/utils/__init__.py
COPY assets/healthCheck /usr/local/bin/healthCheck

RUN chmod +x /usr/local/bin/generateKey
RUN chmod +x /usr/local/bin/createAccounts
RUN chmod +x /usr/local/bin/fundAccounts
RUN chmod +x /usr/local/bin/fundAccountsWithToken
RUN chmod +x /usr/local/bin/healthCheck

RUN mkdir /root/.rif-comms && mkdir -p /root/.ethereum/keystore
COPY assets/keystore.zip /root/.ethereum/keystore
RUN cd /root/.ethereum/keystore && unzip keystore.zip && rm keystore.zip

EXPOSE $NODE_PORT
# RIF COMMS 
EXPOSE 6010
# RIF COMMS WS
EXPOSE 6011
EXPOSE 6012

ENTRYPOINT ["/usr/bin/supervisord"]
