# TLP-Switcher

TLP-Switcher is very basic gnome shell extension for switching TLP configurations

![Screenshot](https://cloud.githubusercontent.com/assets/9300522/25596313/7c3639b6-2e96-11e7-87be-4ad536d5c38b.png)

## Dependencies
- TLP

## Install
Download and extract zip to `~/.local/share/gnome-shell/extensions/`, and restart gnome shell.

or

Using a browser that supports extension installation, visit https://extensions.gnome.org/extension/1212/tlp-switcher/

## How To

1. Place TLP configuration files in `~/.tlp/`.

2. Create a new profile:
    * From currently running configuration (omitting any default settings):  
        `tlp-stat -c | sed '/defaults.conf/d' | sed 's/.*L[0-9]\{4\}: //' > ~/.tlp/MyProfile`

    * From template:  
        `cp /etc/tlp.d/00-template.conf ~/.tlp/MyProfile`  
        See https://linrunner.de/tlp/settings/ for details on the available parameters.

3. Selecting a profile will prompt you for root access to run [tlp_update.sh](tlp_update.sh). This script copys your profile to `/etc/tlp.conf` and runs `tlp start`.  
Changes to `~/.tlp/` (adding/removing profiles) are reflected (not applied) automatically.

## Gnome Version
This extension is built and tested under gnome 3.24.1. It *may* work on previous versions of gnome but the metadata.json file only lists 3.24+. You can simply edit it and add your gnome version (if it works fine, leave me a comment so I can update the metadata.json).
