#!/bin/sh
kubectl delete deployment nirop-bill nirop-crown nirop-keel nirop-mantle nirop-sing
kubectl delete service nirop-bill nirop-crown nirop-keel nirop-mantle nirop-sing
kubectl delete configmap env-config
kubectl delete secret env-secret aws-secret