#!/bin/sh

echo Mirroring $NAME

echo Cloning source...
git clone --mirror $SOURCE source

cd source

git remote add destination $DESTINATION

echo Pushing to destination...
git push destination --mirror

echo Done!
