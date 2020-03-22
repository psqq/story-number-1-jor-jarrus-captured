
clean:
	shx rm -rf ./img && shx rm -rf ./js && shx rm -rf ./src && shx rm -rf ./css && shx rm -rf ./favicon.ico && shx rm -rf ./index.html

build:
	shx cp -R ./dist/* ./

all: build
