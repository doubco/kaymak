module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    webfont:
      icons:
        src: 'dev/icons/*.svg'
        dest: 'icons'
        destCss: 'dev'
        options:
          font: 'icons'
          rename: (name) ->
            class_name = name.toLowerCase()
            class_name = class_name.replace("i_", "")
            remove_path = class_name.lastIndexOf('/')
            class_name = class_name.substr((remove_path + 1))
            return class_name
          syntax: "bootstrap"
          hashes: false
          engine:"node"
          templateOptions:
            baseClass: "icon"
            classPrefix: "icon-"
            mixinPrefix: "icon-"
          stylesheet: "styl"
          relativeFontPath: "/icons"
          embed: ['woff', 'ttf', 'svg', 'eot']

    coffee:
      compile:
        options:
          bare: true
        files:
          'kay.js': [
            'dev/**/*.coffee',
          ]

    stylus:
      compile:
        options:
          compress: false
          paths: ['dev']

        files: [
          'kay.css': 'dev/kay.styl'
          'demo.css': 'dev/demo.styl'
        ]

    jade:
      templates:
        files: [{ 
          expand: true
          src: "**/*.jade"
          dest: ""
          cwd: "dev"
          ext: ".html"
        }]

        options:
          compileDebug: true

    watch:
      coffee:
        files: ['dev/**/*.coffee']
        tasks: ['coffee']

      stylus:
        files: ['dev/**/*.styl']
        tasks: ['stylus']

      jade:
        files: ['dev/**/*.jade']
        tasks: ['jade:templates']


    cssmin:
      minify:
          expand: true
          cwd: ''
          src: ['*.css', '!*.min.css']
          dest: ''
          ext: '.min.css'

    uglify:
      kay:
        options:
          mangle: false
        files:
          'kay.min.js': ['kay.js']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-webfont'

  grunt.registerTask 'default', [
    'webfont',
    'coffee',
    'stylus',
    'jade:templates',
    'watch'
  ]

  grunt.registerTask 'prod', [
    'webfont',
    'coffee',
    'stylus',
    'jade:templates',
    'uglify'
    'cssmin'
  ]
