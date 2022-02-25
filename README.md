# Private Mode
##### A Firefox add-on for quickly enabling and disabling privacy features

Private Mode is an add-on for Firefox (version 59.0 or higher). It provides
a button that can be used to toggle "Private Mode": a state in which the
user is protected from many forms of fingerprinting.

## Functionality
Currently, Private Mode:
 - Enables the "privacy.resistFingerprinting" preference
 - Sets "network.http.sendRefererHeader" to 0
 - Disables WebGL via JavaScript injection
 - Disables IndexedDB to prevent private browsing mode detection via
   JavaScript injection
 - Disables service workers via JavaScript injection

Note that the first two settings are reset to false and 2 respectively
and JavaScript is no longer injected when Private Mode is disabled.

Each of these features can also be disabled by going to the options page,
which can be found from the link in about:addons.

To toggle Private Mode, click on its icon while it is in the toolbar,
or press Ctrl+Alt+P (Cmd+Alt+P on MacOS).

## Installation
To install Private Mode, navigate to
[Releases](https://github.com/thomasebsmith/private-mode/releases) and
click on the latest `signed.xpi` file. Allow extension installation, and
give Private Mode the permissions it needs.
