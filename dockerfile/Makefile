all: build

archive_head:
	cd .. && git archive --prefix=cloud9/ --format=tar geo/master | gzip -9 >dockerfile/cloud9-master.tar.gz

archive_stash:
	cd .. && git archive --prefix=cloud9/ --format=tar $$(git stash create) | gzip -9 >dockerfile/cloud9-master.tar.gz

build: archive_stash
	docker build --rm=true -t 'tai_c9/cloud9:v0' .

clean:
	git gc --prune=now

.PHONY: archive_head archive_stash build