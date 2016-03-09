module.exports  = function(grunt) {
    var nowTime = new Date(); 
    var mainPageCommitMessage = "autoCommit" + nowTime.getTime(); 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'assets/js/javascript.min.js':'assets/js/javascript.js'
                }
            }
        },
        clean: {
            options:{
                force: true,
            },
            ghPages: ["../FarmPrivateKitchen_gh-pages/*" ] 
            
        },
        copy_mate: {
            ghPages: {
                options: {
                    type: "recursive"
                },
                src: "_site/",
                destDir: '../FarmPrivateKitchen_gh-pages/'
            },
        },

        gitadd: {
            mainPage:{
                options: {
                    all: true,
                    cwd: "../anzizhao.github.io" 
                }
            },
            profile:{
                options: {
                    all: true,
                    cwd: "." 
                }
            },
        },
        gitcommit: {
            mainPage: {
                options: {
                    cwd: "../anzizhao.github.io",
                    message: mainPageCommitMessage 
                },
            },
            profile: {
                options: {
                    cwd: ".",
                    message: "上线自动化步骤" 
                },
            },
        },
        gitcheckout:{
            current:{
                options:{
                   create: true, 
                   branch: '<%= gitcheckout.current.branch %>'
                },
            } 
        },
        gitpush: {
            mainPage: {
                options: {
                    remote: "origin",
                    branch: "master",
                    cwd: "../anzizhao.github.io" 
                }
            },
        },
        gitpull: {
            mainPage: {
                options: {
                    remote: "origin",
                    branch: "master",
                    cwd: "../anzizhao.github.io" 
                }
            },
        },
        gitarchive: {
            master: {
                options: {
                    format: 'tar.gz',
                    prefix: 'your-project-name/',
                    treeIsh: 'master',
                    output: '/tmp/your-project-name.tar.gz',
                    path: ['README', 'LICENSE']
                }
            }
        },
        run: {
            npmBuild: {
                 exec: 'npm run build',
            },
            tag: {
                 exec: 'git archive static_i | tar -x -C ../anzizhao.github.io',
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    //grunt.loadNpmTasks('grunt-contrib-uglify');

    //这版本copy 不强大
    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-copy-mate');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-run');

    // 默认被执行的任务列表。
    grunt.registerTask('min', ['uglify']);
    grunt.registerTask('cp', ['copy_mate:ghPages']);
    grunt.registerTask('serve', ['jekyll:master_serve']);
    grunt.registerTask('build', ['jekyll:ghPages_build']);
    //更新另一个目录的gh-pages分支
    grunt.registerTask('gh-cm', ['build', 'clean:ghPages', 'copy_mate:ghPages', 'gitadd:ghPages', 'gitcommit:ghPages']);
    grunt.registerTask('gh-push', ['gh-cm', 'gitpush:ghPages']);
    grunt.registerTask('pull', ['gitpull']);

    //推分支到github 
    grunt.registerTask('master-push', "grunt master-push --message= ,master 分支推到github",
                        function(){
                             var message = grunt.option("message");
                             grunt.config.set('gitcommit.master.message', message);
                             grunt.task.run(['gitadd:master','gitcommit:master','gitpush:master']);
                        }
                      );


    //从现在基础上分支, 不知道这个是否同步的,后面在确定
    grunt.registerTask("newbranch", "grunt newbranch --branch=  --message= 基于现在分支建立新分支b, 分支提交使用m信息",
                        function () {
                             var branchName = grunt.option("branch"); 
                             var message = grunt.option("message");
                             grunt.config.set('gitcommit.master.message', message);
                             grunt.config.set('gitcheckout.current.branch', branchName);
                             grunt.task.run(['gitadd:master','gitcommit:master','gitcheckout:current']);
                        }
                      );


    // 清理  编译 打包 推git
    grunt.registerTask('tag', "grunt tag --message=  --start=   --list",
                        function(){
                             var message = grunt.option("message");
                             var start = grunt.option("start") || 1;
                             var list = grunt.option("list");
                             var cmds = [   'gitpull:mainPage',
                                            'run:npmBuild',
                                            'gitadd:profile',
                                            'gitcommit:profile',
                                            'run:tag',
                                            'gitadd:mainPage',
                                            'gitcommit:mainPage',
                                            'gitpush:mainPage'];
                             if ( message ) {
                                 grunt.config.set('gitcommit.mainPage.message', message);
                             }

                             if ( list ) {
                                 cmds.forEach(function(item, index ){
                                     console.log( (index+1) +'. ' + item ) 
                                 })
                                 return 
                             }

                             var runCmds = cmds.filter(function(item, index){
                                    return  (index+1) >= start  
                             })

                             grunt.task.run( runCmds )
                             //runCmds.forEach(function(item, index ){
                                 //console.log( (index+1) +'. ' + item ) 
                             //})
                        
                             //grunt.task.run([
                                            //'gitpull:mainPage',
                                            //'run:npmBuild',
                                            //'gitadd:profile',
                                            //'gitcommit:profile',
                                            //'run:tag',
                                            //'gitadd:mainPage',
                                            //'gitcommit:mainPage',
                                            //'gitpush:mainPage']);
                        }
                      );

};

