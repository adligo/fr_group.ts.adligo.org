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
const { spawnSync } = require('child_process');
const IS_WIN = process.platform === "win32";
var npm = 'npm'
if (IS_WIN) {
  npm = 'npm.cmd'
}

function out(cmd, spawnSyncReturns) {
  console.log('ran ' + cmd );
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
  }
}

function run(cmd, args) {
  var cc = cmd;
  if (args != undefined) {
    for (var i=0; i < args.length; i++) {
      cc = cc + ' ' + args[i];
    }
  }
  out(cc, spawnSync(cmd, args));
}

var base =  'https://github.com/';
for (var i=0; i < process.argv; i++) {
  let arg = argv[i];
  if (arg == '--ssh') {
    base = 'git@github.com:'
  }
}

run('git',['clone',base + 'adligo/cli.ts.adligo.org.git']);
run('git',['clone',base + 'adligo/cli_tests.ts.adligo.org.git']);
run('git',['clone',base + 'adligo/fr.ts.adligo.org.git']);
run('git',['clone',base + 'adligo/fr_tests.ts.adligo.org.git']);
run('git',['clone',base + 'adligo/i_io.ts.adligo.org.git']);
run('git',['clone',base + 'adligo/paths.ts.adligo.org.git']);
run('git',['clone',base + 'adligo/paths_tests.ts.adligo.org.git']);
run('git',['clone',base + 'adligo/tests4j.ts.adligo.org.git']);
run('git',['clone',base + 'adligo/junitXml.tests4j.ts.adligo.org.git']);