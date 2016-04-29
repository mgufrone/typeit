module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1,
        report: 'gzip'
      },
      target: {
        files: {
          'css/main.min.css': ['css/main.css']
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          "bower_components/pixi.js/bin/pixi.min.js",
          "bower_components/SoundJS/lib/soundjs-0.6.2.min.js",
          "js/constants.js",
          "js/extensions.js",
          "js/stage.js",
          "js/game.js",
          "js/main.js"
        ],
        dest: 'js/dist.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: "js/dist.js",
        dest: 'js/main.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js','assets/js/*.js','!assets/js/dist.js','!assets/js/main.min.js'],
        tasks: ['concat','uglify'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['assets/css/main.css'],
        tasks: ['cssmin'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('default', ['cssmin','concat','uglify']);

};
