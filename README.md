# MakeHTML
##### by Andrew4d3

MakeHTML is a Gulp boilerplate to kickstart your static HTML web projects. It's designed to simplify the building of HTML pages using less, auto-refresh, bower and other features. Do not use it for compplex projects like web applications. Use it for building simple landing pages with few links and information, or if you want to build some HTML templates.

## What does it include?

* Bootstrap.
* Normalize CSS.
* Font-awesome.
* Auto-refresh using Browsersync.
* Auto-injecting of bower libraries (requires restart).
* Auto-injecting of custom JS files or CSS stylesheets.
* Template rendering using Nunjucks.

## Requirements
In order to use this boilerplate, you require to have NodeJS installed.

## How to use it?

* Install gulp and bower globally if you don't have them installed yet. Otherwise, skip to next step. 
```
$ npm install gulp -g
$ npm install bower -g
```
* Clone this repository.
```
$ git clone https://github.com/Andrew4d3/makehtml
$ cd makehtml
```
* Run bower and npm install
```
$ npm install
$ bower install
```
* Run gulp
```
$ gulp
```

And start creating your awesome page :)

## Generate Dist Folder
In order to get a dist folder you have to run:
```
$ gulp build
```
This command will generate a dist folder with all the code and dependecies used. All the files will be correctly mimified and concatenated so that they can run quickly on production. You can extract/copy this folder and paste it in any server container. It should work properly without depending on gulp nor nodejs.

## Using Nunjucks

This boilerplate includes Nunjucks, which is a template engine to render HTML pages in an easy way. In order to use it, you have to run gulp with the templates flag activated:
 ```
 $ gulp --templates
 ```
 Now you can build your pages with nunjucks by using the src/pages and src/templates folders. Anytime you make changes at those paths, it will generate new html pages at src/, these are the ones run by the server.
 
 *WARNING*: Keep in mind that if you decide to use Nunjucks after starting building your pages without it. All HTML pages at src/ will be completely overwritten by the new pages generated using the template engine. So you might lose some (or all) code developed there. My advice here is: **If you started building without Nunjucks. DO NOT USE IT! Or you might lose precious work by doing so.**
 
 [Check Nunjucks home site to learn how to use it](https://mozilla.github.io/nunjucks/)
 
## License
 
 MIT License. Feel free to use it in any commercial or open source project.
