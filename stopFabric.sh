#!/bin/bash
#
# Script to shut everything down 
#
# Exit on first error, print all commands.
set -ev

docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker network prune


