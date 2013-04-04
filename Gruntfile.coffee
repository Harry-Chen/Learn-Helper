module.exports = (grunt) ->
  'use strict'
  grunt.loadNpmTasks 'grunt-crx'
  ############
  # iced-coffee-script

  grunt.registerMultiTask 'iced', 'Compile IcedCoffeeScript files into JavaScript', ->
    path = require('path')
    options = @options(
      bare: false
      separator: grunt.util.linefeed
    )
    grunt.fail.warn 'Experimental destination wildcards are no longer supported. please refer to README.'   if options.basePath or options.flatten
    grunt.verbose.writeflags options, 'Options'
    @files.forEach (f) ->
      output = f.src.filter((filepath) ->
        if grunt.file.exists(filepath)
          true
        else
          grunt.log.warn 'Source file \'' + filepath + '\' not found.'
          false
      ).map((filepath) ->
        compileCoffee filepath, options
      ).join(grunt.util.normalizelf(options.separator))
      if output.length < 1
        grunt.log.warn 'Destination not written because compiled files were empty.'
      else
        grunt.file.write f.dest, output
        grunt.log.writeln 'File ' + f.dest + ' created.'

  compileCoffee = (srcFile, options) ->
    options = grunt.util._.extend filename: srcFile, options
    srcCode = grunt.file.read srcFile
    try
      return require('iced-coffee-script').compile srcCode, options
    catch e
      grunt.log.error e
      grunt.fail.warn 'CoffeeScript failed to compile.'


  ############
  # main config

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json'),
    crx:
      myPublicPackage:
        src : "src/"
        dest : "dist/"
        privateKey : "learn.pem"
        filename: "learn-helper-<%= manifest.version %>.crx"
    iced:
      all:
        options:
          runtime: 'inline'
        files: [
          {
            expand: true
            src: ['coffee/*.iced', 'coffee/*.coffee']
            dest: 'src/js/'
            ext: '.js'
          }
        ]

  grunt.registerTask 'default', [ 'iced:all', 'crx:myPublicPackage']
