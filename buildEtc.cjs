/**
  * Copyright 2023 Adligo Inc / Scott Morgan
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */
const { execSync, spawnSync } = require('child_process');
const IS_WIN = process.platform === "win32";
console.log('IS_WIN? = ' + IS_WIN);
var npm = 'npm'
if (IS_WIN) {
  npm = 'npm.cmd'
}

function out(cmd, spawnSyncReturns, options) {
  console.log('ran ' + cmd );
  if (options != undefined) {
    //console.log('\twith options ' + JSON.stringify(options));
    if (options.cwd != undefined) {
      console.log('\tin ' + options.cwd);
    } 
  }
  console.log('\tand the spawnSyncReturns had;');
  if (spawnSyncReturns.error != undefined) {
    console.log('\tError: ' + spawnSyncReturns.error);
    console.log('\t\t' + spawnSyncReturns.error.message);
  }  
  if (spawnSyncReturns.stderr != undefined) {
    console.log('\tStderr: ' + spawnSyncReturns.stderr);
  }
  if (spawnSyncReturns.stdout != undefined) {
    console.log('\tStdout: ' + spawnSyncReturns.stdout);
    return spawnSyncReturns.stdout;
  }
  console.log('\tStdout: ' + spawnSyncReturns);
  return '' + spawnSyncReturns;
}

function run(cmd, options) {
  var cc = cmd;
  return out(cc, execSync(cmd, options), options);
}


const projects = ['cli.ts.adligo.org',
'cli_tests.ts.adligo.org',
'fr.ts.adligo.org',
'fr_tests.ts.adligo.org',
'i_io.ts.adligo.org',
'paths.ts.adligo.org',
'paths_tests.ts.adligo.org',
'strings.ts.adligo.org',
'strings_tests.ts.adligo.org',
'tests4j.ts.adligo.org',
'xml.tests4j.ts.adligo.org'];

function toUnixPath(path) {
  var r = '';
  var i=0;
  if (path.charAt(1) == ':') {
    r = '/' + path.charAt(0) + '/';
    i = 3;
  }
  for (; i< path.length; i++) {
    let c = path[i];
    if (c == '\\') {
      r = r.concat('/');
    } else if (c == ' ') {
      throw Error('Paths with spaces are NOT allowed in the following path ! ' + path);
    } else {
      r = r.concat(c);
    }
  }
  return r;
}

function toWindowsPath(path) {
  var r = '';
  var i=0;
  for (; i< path.length; i++) {
    let c = path[i];
    if (c == '/') {
      r = r.concat('\\');
    } else if (c == ' ') {
      throw Error('Paths with spaces are NOT allowed in the following path ! ' + path);
    } else {
      r = r.concat(c);
    }
  }
  return r;
}

function toOSPath(path) {
  if (IS_WIN) {
    return toWindowsPath(path);
  } else {
    return toUnixPath(path);
  }
}

const dir = process.cwd();
var ps = '/';
if (IS_WIN) {
  ps = '\\';
}

function gitClone(ssh) {
  console.log('in gitClone ' + ssh);
  var base =  'https://github.com/';
  if (ssh) {
    base = 'git@github.com:'
  }
  projects.forEach((p) => {
    run('git',['clone',base + 'adligo/' + p ]);
  });
}

function slink() {
  for(var i=0; i < projects.length; i++) {
    let p = projects[i];
    let pdir = dir + ps + p;
    let osdir = toOSPath(pdir);
    let udir = toUnixPath(pdir);
    //let cmd = 'slink --debug --dir '+ udir;
    let cmd = 'slink --version --debug';
    //run('pwd',{ cwd: osdir});
    //run(cmd,{ cwd: osdir});
    //run('which slink',{ cwd: osdir});
    run('slink --dir ' + udir,{ cwd: osdir});
  }
}


const args = process.argv;
console.log('processing args ' + args.length);
console.log('in ' + dir)
//run('slink',{ cdw:  'C:\\Users\\scott\\org-src\\fr_group.ts.adligo.org\\tests4j.ts.adligo.org'});
try {
  for (var i=2; i < args.length; i++) {
    let arg = args[i];
    console.log('processing arg ' + arg);
    switch (arg) {
      case "--git-clone": gitClone(false); break;
      case "--git-clone-ssh": gitClone(true); break;
      case "--slink": slink(); break;
      default: throw Error('unknown command '+ arg);
    }
  }
} catch (e) {
  console.error(e.message);
}