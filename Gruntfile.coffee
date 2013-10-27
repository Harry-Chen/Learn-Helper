module.exports = (grunt) ->
	'use strict'
	#############
	# plugins
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-stylus'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-iced-coffee'

	grunt.registerMultiTask 'template', ->
		for file in @files
		  src=file.src[0]
		  dest=file.dest
		  cont=grunt.template.process grunt.file.read(src, encoding: 'utf-8')
		  cont=cont.replace(/\r\n/g, '\n')
		  grunt.file.write(dest, cont, encoding: 'utf-8')

	############
	# main
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'
		template:
			manifest:
				files: [
					{src: 'src/manifest.json', dest: 'build/manifest.json' }
				]
		stylus:
			all:
				options:
					urlfunc: 'embedurl'
					compress: false
					"include css": true
				files: [
					{
						expand: true
						cwd: 'src/stylus/'
						src: ['**/*.styl', '!**/_*.styl']
						dest: 'build/css/'
						ext: '.css'
					}
				]
		coffee:
			compile:
				options:
					runtime: 'inline'
				files: [
					{
						expand: true
						cwd: 'src/iced/'
						src: ['**/*.iced', '**/*.coffee']
						dest: 'build/js/'
						ext: '.js'
					}
				]
		copy:
			asset:
				files: [
					{
						expand: true
						cwd: 'src/asset/'
						src: '**/*'
						dest: 'build/'
					},
					{
						expand: true
						cwd: 'src/html/'
						src: '**/*'
						dest: 'build/'
					}
				]
		watch:
			options:
				spawn: false
			asset:
				files: ['src/asset/**/*', 'src/html/**/*']
				tasks: ['copy:asset']
			coffee:
				files: ['src/iced/**/*']
				tasks: ['coffee']
			css:
				files: ['src/stylus/**/*']
				tasks: ['stylus']

		clean:
			files: ['build', 'tmp', 'dist']

	grunt.registerTask 'manifest', [
		'template:manifest'
	]
	grunt.registerTask 'default', [
		'stylus'
		'coffee:compile'
		'copy:asset'
		'manifest'
	]
	grunt.registerTask 'dev', [
		'default'
		'watch'
	]
