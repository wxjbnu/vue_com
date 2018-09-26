#!/bin/bash -x
DEST_DIR=$1

npm run dev && cp dist/* ${DEST_DIR}