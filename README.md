# Private Mode
##### A Firefox add-on for quickly enabling and disabling privacy features

Private Mode is an add-on for Firefox (version 58.0 or higher). It provides
a button that can be used to toggle "Private Mode": a state in which the
user is protected from many forms of fingerprinting.

## Functionality
Currently, Private Mode:
 - Enables the "privacy.resistFingerprinting" preference
 - Sets "network.http.sendRefererHeader" to 0
 - Disables WebGL via JavaScript injection
 - Disables IndexedDB to prevent private browsing mode detection via
   JavaScript injection

Note that the first two settings are reset to false and 2 respectively
and JavaScript is no longer injected when Private Mode is disabled.

Each of these features can also be disabled by going to the options page,
which can be found from the link in about:addons.

## Installation
Private Mode is not yet available on addons.mozilla.org. To use it,
enable developer mode and load the add-on manually in about:debugging.
