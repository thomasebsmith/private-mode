# Private Mode
##### A Firefox add-on for quickly enabling and disabling privacy features

Private Mode is an add-on for Firefox (version 58.0 or higher). It provides
a button that can be used to toggle "Private Mode": a state in which the
user is protected from many forms of fingerprinting.

Currently, private mode:
 - Enables the "privacy.resistFingerprinting" preference
 - Sets "network.http.sendRefererHeader" to 0

Note that these settings are reset to false and 2 respectively when Private
Mode is disabled.
