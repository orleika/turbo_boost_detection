#!/bin/sh

set -eux

cd /var/www
forever stop server.js
sudo cp -Rf $HOME/turbo_boost_detection/* /var/www/
sudo npm i
NODE_ENV=production HOST=`hostname`.gq MONGODB_URI=mongodb://localhost/turbo forever start server.js
