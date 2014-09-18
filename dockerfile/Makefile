all: build

archive:
	cd .. && git archive --prefix=cloud9/ --format=tar master | gzip -9 >dockerfile/cloud9-master.tar.gz

build: archive
	docker build --rm=true -t 'tai_c9/cloud9:v0' .

.PHONY: archive build