all: build

archive:
	git archive --format=tar master | gzip >cloud9-master.tar.gz

build: archive
	docker build --rm -t 'tai_c9/cloud9:v0' .

.PHONY: archive build