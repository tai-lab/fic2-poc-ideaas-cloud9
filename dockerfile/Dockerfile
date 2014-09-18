FROM ubuntu:14.04
MAINTAINER Tai <tai@thalesgroup.com>
RUN apt-get -y update
#RUN apt-get -y upgrade
RUN apt-get -y install libxml2-dev nodejs nodejs-legacy npm mercurial
RUN npm install -g nvm

RUN /usr/sbin/useradd -U -m --shell /bin/bash ubuntu
RUN /usr/sbin/adduser ubuntu sudo
RUN echo 'ubuntu:ubuntu' | chpasswd

ENV HOME /root
RUN nvm install 0.8.22
ADD ../../cloud9 /var/opt/

USER ubuntu
ENV HOME /home/ubuntu
RUN echo "hi: '$HOME'" > /home/ubuntu/text.txt

#EXPORT 5000