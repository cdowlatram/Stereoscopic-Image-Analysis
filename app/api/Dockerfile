# get base image for app docker image
FROM node:12.13.1

# create directory for api code
RUN mkdir -p /app/api

# set working directory to 
WORKDIR /app/api

# copy app dependency files to docker
COPY package.json /app/api
COPY package-lock.json /app/api

# copy api code to api directory
COPY . /app/api

# Run apt-get update within docker image to update package list.

RUN apt-get update && apt-get install -y \
        python3-pip \
        python3-dev

# Install node dependencies
RUN npm install

# Install pip3, pip3 will install the requirements.txt for the app

RUN pip3 install -r sources/python/requirements.txt


# start server
CMD ["npm", "start"]