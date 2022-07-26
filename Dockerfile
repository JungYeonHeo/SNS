FROM node:14

RUN mkdir -p /home/ec2-user/SNS/node_modules && chown -R node:node /home/ec2-user/SNS

WORKDIR /home/ec2-user/SNS

COPY package*.json ./

USER root

RUN npm install

COPY --chown=node:node . .

CMD [ "npm", "start" ]