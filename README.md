# TLP-Switcher

TLP-Switcher is very basic gnome shell extension for switching TLP configurations

![Screenshot](https://cloud.githubusercontent.com/assets/9300522/25596313/7c3639b6-2e96-11e7-87be-4ad536d5c38b.png)

## Dependencies
- TLP

## How To
Place TLP configuration files in `~/.tlp/`.

Create a new profile:

`tlp-stat -c > ~/.tlp/MyProfile`

or

`cp /etc/default/tlp ~/.tlp/MyProfile`

Selecting a profile will prompt you to run [tlp_update.sh](tlp_update.sh) as root. This script copys your profile to `/etc/default/tlp` and runs `tlp start`. 

Changes to `~/.tlp/` (adding/removing profiles) are reflected (not applied) automatically.
