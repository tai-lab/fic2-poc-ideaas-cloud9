#! /bin/bash
set -x

TMP=`pwd`
for i in ${CLONES}
do
    REPO=`basename ${i} '.git'`
    if [ -d "${HOME}/workspace/${REPO}/.git" ]; then
	echo "The repository '${HOME}/workspace/${REPO}' already exists"
    else
	cd "$HOME/workspace" && git clone "$i"
    fi
done
cd "$TMP"

set +x


if [ -z "${C9PORT}" ]; then 
    PORT=""
else 
    PORT="-p ${C9PORT}"
fi

if [ -z "${C9TRACE}" ]; then
    TRACE=""
else
    TRACE="--trace"
fi


bin/cloud9.sh -l 0.0.0.0 $PORT --username "$C9USERNAME" --password "$C9PASSWORD" -w "$HOME/workspace" $TRACE
