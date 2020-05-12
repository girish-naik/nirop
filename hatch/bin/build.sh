#!/bin/sh
for dir_name in $NIROPSRC/*/
do
    if [ -f $dir_name"/Dockerfile" ]; then
        if [ -f $dir_name"/package.json" ]; then
            if [ -f $dir_name"/package-lock.json" ]; then
                rm -rf $dir_name/package-lock.json
            fi
            echo "Building $dir_name"
            yarn --cwd $dir_name
            if [ $? -gt 0 ]; then
                echo "Failed building $dir_name"
                exit 1
            fi
            echo "Packaging $dir_name"
            yarn --cwd $dir_name --silent build
            if [ $? -gt 0 ]; then
                echo "Failed packaging $dir_name"
                exit 1
            fi
        fi
    fi
done

echo "Building docker images"
docker-compose -f $NIROPSRC/hatch/docker/docker-compose-build.yaml build --parallel --no-cache
exit 0