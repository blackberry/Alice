module.exports = function(grunt) {

  grunt.initConfig({
    qunit: {
      files: ['tests/qunit/*.html']
    },

    jasmine: {
      alice: {
        src: ['src/alice.core.js'],
        options: {
          specs:   'tests/jasmine/*.js',
          version: '1.3.1'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  
  // A convenient task alias.
  grunt.registerTask('test', 'qunit', 'jasmine');

};
