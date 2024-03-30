all: log

log:
	git log --all --decorate --oneline --graph

diff:
	git diff --output="./.hidden/patch.diff"

diff-staged:
	git diff --staged --output="./.hidden/patch.diff"