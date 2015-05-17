# geofire-poc

A proof of concept project about geofire,angular,ionic and angular google map libraries.

## Install
---
This project is based on ionic and gulp, so:
* Install all gulp tools : *npm install*
* Install bower dependencies : *bower install*
* Create the config personal file : *gulp init-config* 

You should set up the google api key and firebase URI changing these 
values into the created config-"env".json file in www/js folder.

* Launch default gulp task and launch server: **ionic serve**
* Test on android movile device: **ionic run android**

---

## Functionalities
* Create new position into the server [Finished]
* Delete a created position [Finished]
* Browse positions by geoQuery. [Finished]
* Browse positions in a google map. [Working on...]
* Setup test system
* Setup centralized log system
