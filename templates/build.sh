#!/bin/bash -x
DEST_DIR=$1

npm run build:umd && cp dist/* ${DEST_DIR}