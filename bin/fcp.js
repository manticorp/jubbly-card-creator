#!/usr/bin/env node

var fcp = require('../lib/fcp'),
    args = process.argv.slice(2),
    source, dest;

if (args.length < 2) {
  console.error('Usage: fcp [source] [destination] [--filter=filter] [--no-overwrite] [--overwrite] [--limit=concurrency limit]');
  process.exit(1);
}

// parse arguments the hard way
function startsWith(str, prefix) {
  return str.substr(0, prefix.length) == prefix;
}

var options = {};
args.forEach(function (arg) {
  if (startsWith(arg, "--limit=")) {
    options.limit = parseInt(arg.split('=', 2)[1], 10);
  }
  if (startsWith(arg, "--filter=")) {
    options.filter = new RegExp(arg.split('=', 2)[1]);
  }
  if (startsWith(arg, "--overwrite")) {
    options.clobber = true;
  }
  if (startsWith(arg, "--no-overwrite")) {
    options.clobber = false;
  }
  if (startsWith(arg, "--stoponerr")) {
    options.stopOnErr = true;
  }
});

fcp.fcp(args[0], args[1], options, function (err) {
  if (Array.isArray(err)) {
    console.error('There were errors during the copy.');
    err.forEach(function (err) {
      console.error(err.stack || err.message);
    });
    process.exit(1);
  }
  else if (err) {
    console.error('An error has occurred.');
    console.error(err.stack || err.message);
    process.exit(1);
  }
});