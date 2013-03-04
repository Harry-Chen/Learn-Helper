module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    stylus: {
      all: {
        options: {
          urlfunc: 'embedurl'
        },
        files: [
          {
            expand: true,
            cwd: 'stylus/',
            src: ['**/*.styl', '!**/_*.styl'],
            dest: 'css/',
            ext: '.css'
          }
        ]
      }
    },
    watch: {
      stylus: {
        files: ['stylus/**/*.styl'],
        tasks: ['stylus']
      }
    },
    connect: {
      server: {
        options: {
          port: 9999,
          hostname: '0.0.0.0',
          base: '.'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default',  ['stylus', 'connect', 'watch']);

};
