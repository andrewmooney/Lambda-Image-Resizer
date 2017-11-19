#############################################################################
# Dockerfile for Amazon Linux.                                              #
# Use case: Building Lambda packages                                        #
# Includes: Nodejs v6.10.0,                                                 #
#           Python 2.7,                                                     #
#           Python 3.6                                                      #
#                                                                           #
#                                                                           #
# How to build:                                                             #
# docker build --no-cache -t amazonlinux-lambda -f Dockerfile .             #
# How to run:                                                               #
# docker run --rm -it -p 9999:9999 -v $(pwd):/workspace amazonlinux-lambda  #
#############################################################################

FROM amazonlinux:latest
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Configure environment
ENV APP_HOME /app
ENV APP_SRC $APP_HOME
ENV NVM_DIR /tmp
ENV NODE_VERSION 6.10.0

ADD . $APP_HOME

RUN echo 'alias ll="ls -ltha"' >> ~/.bashrc
RUN mkdir -p $NVM_DIR 

# Install reqiured dependencies
RUN yum -y update && \
    yum -y install \
    gcc-c++ \
    vim \
    zip \
    unzip \
    python36

RUN mkdir /workspace

# Install NVM and Nodejs
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && source ~/.bashrc \
    && nvm install $NODE_VERSION

# Configure path for node and nvm
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/v$NODE_VERSION/bin:$PATH