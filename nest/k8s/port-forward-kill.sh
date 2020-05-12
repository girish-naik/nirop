#!/bin/sh
ps | grep kubectl | grep port-forward | awk '{print $1}' | xargs kill