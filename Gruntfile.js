module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            test: {
                options: {
                    port: 8888
                }
            }
        },
        jasmine: {
            requirejs: {
                src: 'src/**/*.js',
                options: {
                    outfile: 'SpecRunner.html',
                    specs: 'test/spec/**/*.js',
                    host: 'http://localhost:<%= connect.test.options.port%>',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                       requireConfig: {
                           baseUrl: 'src',
                           urlArgs: '?' + (+new Date).toString(36)
                       }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    // 这不是一个grunt task，不需要load，否则会报错
    // grunt.loadNpmTasks('grunt-template-jasmine-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('test', ['connect:test', 'jasmine:requirejs']);
};
