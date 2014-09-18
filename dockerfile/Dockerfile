FROM ubuntu:14.04
MAINTAINER Tai <tai@thalesgroup.com>

ENV HOME /root
RUN apt-get -y update
#RUN apt-get -y upgrade
RUN apt-get -y install curl wget man libxml2-dev nodejs nodejs-legacy npm git-core mercurial
RUN npm install -g sm

RUN /usr/sbin/useradd -U -m --shell /bin/bash ubuntu
RUN /usr/sbin/adduser ubuntu sudo
RUN echo 'ubuntu:ubuntu' | chpasswd


USER root
ENV HOME /root
ADD cloud9-master.tar.gz /var/opt/
RUN chown -R 'ubuntu:ubuntu' /var/opt/cloud9


USER ubuntu
ENV HOME /home/ubuntu
RUN mkdir $HOME/workspace
RUN git clone https://github.com/creationix/nvm.git $HOME/.nvm
RUN echo "source $HOME/.nvm/nvm.sh" >> $HOME/.bashrc
RUN /bin/bash -l -c 'source $HOME/.nvm/nvm.sh && nvm install v0.8.22 && nvm use v0.8.22 && nvm alias default v0.8.22'


RUN /bin/bash -l -c 'source $HOME/.nvm/nvm.sh && cd /var/opt/cloud9 && sm install'

ENV C9PORT 3131
EXPOSE 3131
WORKDIR /var/opt/cloud9
CMD /bin/bash -l -c "bin/cloud9.sh -l 0.0.0.0 -p $C9PORT -w $HOME/workspace"
