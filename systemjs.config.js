/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app':                        'dist/app', // 'app',

    '@angular':                   'node_modules/@angular',
    'express': 'node_modules/express',
    'rxjs':                       'node_modules/rxjs',
    'angular2-modal':             'node_modules/angular2-modal',
    'ng2-material':          'node_modules/ng2-material',
    '@angular2-material':          'node_modules/@angular2-material'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'express': { main: 'index.js', defaultExtension: 'js' },
    'ng2-material': { main: 'index.js', defaultExtension: 'js' },
    'angular2-modal':              { defaultExtension: 'js', main: 'bundles/angular2-modal.umd' }
  };

  // UMD bundles
  map['angular2-modal/plugins/bootstrap'] = map['angular2-modal'] + '/bundles';
  packages['angular2-modal/plugins/bootstrap'] =  { defaultExtension: 'js', main: 'angular2-modal.bootstrap.umd' };
  

  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'upgrade'
  ];

  var ngMaterialPackageNames = [
    'core',
    "checkbox",
    'input',
    'slide-toggle',
    'button'
  ];

  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages[pkgPrefix+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }

  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages[pkgPrefix+pkgName] = { main: bundleDir + pkgName + '.umd.js', defaultExtension: 'js' };
  }

  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  var pkgPrefix = '@angular/';
  var bundleDir = '/bundles/';
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);

  // No umd for router yet
  packages['@angular/router'] = { main: 'index.js', defaultExtension: 'js' };

  // material
  pkgPrefix = '@angular2-material/';
  bundleDir = "/";
  // Add package entries for angular packages
  ngMaterialPackageNames.forEach(setPackageConfig);
  packages['@angular2-material/checkbox'] = { main: 'checkbox.js', defaultExtension: 'js' };

  var config = {
    map: map,
    packages: packages,
    defaultJSExtensions: true
  };

  System.config(config);

})(this);
