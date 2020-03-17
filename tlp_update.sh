#!/bin/bash
cp "$@" /etc/tlp.conf && tlp start
