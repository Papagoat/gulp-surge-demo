const { watch, series, parallel, src, dest, gulp } = require('gulp');
const connect = require('gulp-connect'); // Runs a local webserver
const open = require('gulp-open'); // Opens a URL in a web browser
const exec = require('child_process').exec; // run command-line programs from gulp
const surge = require('gulp-surge'); // Surge deployment

// Launch Chrome web browser
// https://www.npmjs.com/package/gulp-open
function openBrowser(done) {
  var options = {
    uri: 'http://localhost:8080'
  };
  return src('./')
  .pipe(open(options));
  done();
}

// Gulp plugin to run a webserver (with LiveReload)
// https://www.npmjs.com/package/gulp-connect
function server(done) {
  return connect.server({
    root: './',
    port: 8080,
    debug: true,
  });
  done();
}

// Commit and push files to Git
function git(done) {
  return exec('git add . && git commit -m "surge deploy" && git push');
  done();
}

// Deploy
function surgeDeploy(done) {
  return surge({
    project: './',         // Path to your static build directory
    domain: 'acoustic-history.surge.sh'  // Your domain or Surge subdomain
  })
  done();
}

// Deploy command
exports.deploy = series(git, surgeDeploy);

// Default Gulp command
exports.default = series(openBrowser, server);
