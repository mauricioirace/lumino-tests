FROM ubuntu:latest

ARG RSK_CORE_VERSION_CODENAME=PAPYRUS
ARG RSK_CORE_VERSION_NUMBER=2.2.0

ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/root
ENV RSK_CORE_LOCATION=${HOME}/.rsk-core
ENV RSK_CORE_VERSION=${RSK_CORE_VERSION_NUMBER}-${RSK_CORE_VERSION_CODENAME}

RUN apt-get update
RUN apt-get install -y --no-install-recommends wget curl openjdk-8-jre supervisor systemd \
                                    software-properties-common unzip zip ssh lsof nano

# Install RSK.
RUN groupadd --gid 888 rsk && useradd rsk -d /var/lib/rsk -s /sbin/nologin --uid=888 --gid=888

RUN \
  add-apt-repository -y ppa:rsksmart/rskj && \
  apt-get update && \
  (echo rskj shared/accepted-rsk-license-v1-1 select true | /usr/bin/debconf-set-selections )&& \
  apt-get install -y --no-install-recommends rskj && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  rm -f /etc/rsk/node.conf && \
  ln -s /etc/rsk/regtest.conf /etc/rsk/node.conf

# Supervisod CONF
COPY assets/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY assets/information /root
COPY assets/getInfo /usr/bin/getInfo
COPY assets/node.conf /etc/rsk/regtest.conf

# Downloading RSK Core
RUN wget -P ${RSK_CORE_LOCATION} "https://github.com/rsksmart/rskj/releases/download/${RSK_CORE_VERSION_CODENAME}-${RSK_CORE_VERSION_NUMBER}/rskj-core-${RSK_CORE_VERSION_NUMBER}-${RSK_CORE_VERSION_CODENAME}-all.jar"
RUN cp ${RSK_CORE_LOCATION}/*.jar /usr/share/rsk/rsk.jar
RUN chmod +x /usr/bin/getInfo
RUN mkdir -p /var/lib/rsk/database/regtest

COPY assets/rsk-db.zip /var/lib/rsk/database/regtest

RUN cd /var/lib/rsk/database/regtest && unzip rsk-db.zip && rm rsk-db.zip
RUN chmod -R 777 /var/lib/rsk/database/regtest

COPY assets/healthCheck /usr/bin/healthCheck
RUN chmod +x /usr/bin/healthCheck

EXPOSE 4444

ENTRYPOINT ["/usr/bin/supervisord"]
