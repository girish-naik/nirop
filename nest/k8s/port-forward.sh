#!/bin/sh
kubectl port-forward service/nirop-sing 8080:8080 & > ~/logs/nirop-sing-access.log
kubectl port-forward service/nirop-crown 3000:3000 & > ~/logs/nirop-crown-access.log