module.exports = function( grunt ) {
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        clean: {
            plugins: build,
            temp: temp
        },
        transport: {
            options: {
                alias: _.object( alias, alias ),
                idleading: cwd
            },
            apps: {
                expand: true,
                cwd: cwd,
                src: [ '**/*.js' ],
                dest: temp
            }
        },
        concat: {
            apps: {
                options: {
                    include: 'relative'
                },
                files: _.map( outputs, function( output ) {
                    return {
                        src: temp + output,
                        dest: build + output
                    };
                })
            }
        },
        copy: {
            apps: {
                expand: true,
                cwd: cwd,
                src: [ '**/{img,css}/*' ],
                dest: build
            }
        },
        uglify: {
            apps: {
                expand: true,
                cwd: build,
                src: [ '**/*.js' ],
                dest: build
            },
            libs: {
                expand: true,
                cwd: libs,
                src: [ '**/*.js', '!**/*.min.js' ],
                dest: libs,
                ext: '.min.js'
            }
        },
        cssmin: {
            apps: {
                expand: true,
                cwd: build,
                src: [ '**/*.css' ],
                dest: build
            },
            libs: {
                expand: true,
                cwd: libs,
                src: [ '**/*.css', '!**/*.min.css' ],
                dest: libs,
                ext: '.min.css'
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-cmd-transport' );
    grunt.loadNpmTasks( 'grunt-cmd-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

    grunt.registerTask( 'default', [ 'clean', 'transport', 'concat', 'copy', 'uglify', 'cssmin', 'clean:temp' ] );

};

