FROM ubuntu:14.04
MAINTAINER Tai <tai@thalesgroup.com>


ENV HOME /root
RUN apt-get -y update
#RUN apt-get -y upgrade
RUN apt-get -y install curl wget man libxml2-dev nodejs nodejs-legacy npm git-core mercurial pylint
RUN wget -O /tmp/cli.deb 'https://cli.run.pivotal.io/stable?release=debian64&source=github' && dpkg -i /tmp/cli.deb
RUN npm install -g sm

RUN /usr/sbin/useradd -U -m --shell /bin/bash ubuntu
RUN /usr/sbin/adduser ubuntu sudo
RUN echo 'ubuntu:ubuntu' | chpasswd


USER root
ENV HOME /root
ADD cloud9-master.tar.gz /var/opt/
RUN chown -R 'ubuntu:ubuntu' /var/opt/cloud9


RUN echo '. $HOME/.nvm/nvm.sh' >> /etc/profile
RUN echo 'export ETCPROFILELOADED=1' >> /etc/profile
USER ubuntu
ENV HOME /home/ubuntu
RUN mkdir $HOME/workspace
RUN git clone https://github.com/creationix/nvm.git $HOME/.nvm
RUN /bin/bash -l -c 'nvm install v0.8.22 && nvm use v0.8.22 && nvm alias default v0.8.22'


RUN /bin/bash -l -c 'cd /var/opt/cloud9 && npm install'

ENV C9PORT 3131
EXPOSE 3131
WORKDIR /var/opt/cloud9
ENV C9TIMEOUT 15m
CMD /bin/bash -l -c "/usr/bin/timeout -k 10s ${C9TIMEOUT:=15m} ./start_c9.sh"
