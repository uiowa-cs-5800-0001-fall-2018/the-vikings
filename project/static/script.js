///////// AUX FUNCTIONS //////////

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

///////// END AUX FUNCTIONS //////////

var Home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            login: {
                "username": "",
                "password": ""
            },
            register: {
                "email": "",
                "password": "",
                "username": ""
            },
            msg: "",
            status: "",
            requester: ""

        }
    },
    mounted: function() {
        this.token = getCookie("token_vikings")
        if (this.token) {
            this.$http.get('/auth/status', {
                headers: {
                    'Authorization': this.token
                }
            }).then(response => {
                this.requester = response.body.data;
                console.log(this.requester, "qweqwe");
            })
        }

    },
    methods: {
        logout: function() {
            eraseCookie('token_vikings');
            alert("logged out!");
            router.go({ name: 'home' })
        },
        logInUser: function() {
            var login = this.login;
            console.log(login);
            var json = {
                "username": login.username,
                "password": login.password
            }
            // var res = "";
            console.log(json);
            this.$http.post('/auth/login', json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                body = response.body
                this.status = body.status
                if (body.status == "success") {
                    this.msg = "Successfully logged in, directing to your homepage."
                    setCookie('token_vikings', 'Bearer ' + body.auth_token, 365);
                    setTimeout(function() {
                        router.push({ name: 'profile', params: { username: json.username } })
                    }, 3000);
                } else if (body.status == "fail") {
                    this.msg = "Given info doesn't match with our records."
                } else {
                    this.msg = "Something unexpected happened, please try again later."
                }

            });
        },
        registerUser: function() {
            var register = this.register;
            var json = {
                "username": register.username,
                "email": register.email,
                "password": register.password,
                "password2": register.password2
            }
            if (register.password == register.password2) {
                this.$http.post('/auth/register', json, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    body = response.body
                    this.status = body.status
                    if (body.status == "success") {
                        this.msg = "Successfully registered and logged in, directing to your homepage."
                        setCookie('token_vikings', 'Bearer ' + body.auth_token, 365);
                        setTimeout(function() {
                            router.push({ name: 'profile', params: { username: json.username } })
                        }, 3000);
                    } else if (body.status == "fail") {
                        this.msg = "There is already a user with this username or email."
                    } else {
                        this.msg = "Something unexpected happened, please try again later."
                    }

                });
            } else {
                this.msg = "Passwords doesn't match"
            }

        }
    }
})


var Profile = Vue.extend({
    template: '#profile',
    data: function() {
        return {
            username: this.$route.params.username,
            token: "",
            requester: { username: "" },
            project: {},
            msg: null,
            status: null,
            projects: [],
            query: ""
        }
    },
    mounted: function() {
        this.token = getCookie("token_vikings")
        if (this.token) {
            this.$http.get('/auth/status', {
                headers: {
                    'Authorization': this.token
                }
            }).then(response => {
                this.requester = response.body.data;
            })
        }
        this.$http.get('/user/' + this.username, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (response.body.status == "success") {
                this.projects = response.body.data
            }
        })


    },
    methods: {
        logout: function() {
            eraseCookie('token_vikings');
            alert("logged out!");
            router.go({ name: 'home' })
        },
        removeProject: function(id_,name) {
            
            if (confirm('Are you sure about removing project titled ' + name + '?')) {
                console.log(id_)
                this.$http.post('/remove_project', { "p_id": id_ }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.token
                    }
                }).then(response => {
                    body = response.body
                    this.status = body.status
                    if (body.status == "success") {
                        alert("removed!")
                        router.push({ path: "/redirect/user/" + this.username })
                    }

                });
            } else {
                // Do nothing!
            }
        },
        search: function() {
            this.$http.post('/search', { "query": this.query }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                searchResults = [];
                res = response.body;
                console.log(res)
                projects = res.projects
                users = res.users
                var links = {};
                for (var i = 0; i < projects.length; i++) {
                    searchResults.push(projects[i].name)
                    links[projects[i].name] = "projects" + projects[i].id
                }

                for (var i = 0; i < users.length; i++) {
                    searchResults.push("User: @" + users[i].username)
                    links["User: @" + users[i].username] = "/user/" + users[i].username
                }

                console.log(searchResults)
                $("#searchbox").autocomplete({
                    source: searchResults,
                    select: function(event, ui) {
                        router.push({ path: links[ui.item.label] })

                    }
                });

            });
        },
        createProject: function() {
            if (this.project.is_public) {
                is_public = 1
            } else {
                is_public = 0
            }
            json = { "name": this.project.name, "description": this.project.desc, "is_public": is_public }

            this.$http.post('/create_project', json, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                }
            }).then(response => {
                body = response.body
                this.status = body.status
                if (body.status == "success") {
                    this.msg = "Created, redirecting..."

                    setTimeout(function() {
                        router.push({ name: 'project', params: { project_id: body.pid } })
                    }, 3000);
                } else {
                    this.msg = "Something unexpected happened, please try again later."
                }

            });
        }
    }
})

var Redirect = Vue.extend({
    mounted: function() {
        console.log(this.$route.fullPath.split("/").slice(2, this.$route.fullPath.split("/").length).join("/"))
        router.push({ path: "/" + this.$route.fullPath.split("/").slice(2, this.$route.fullPath.split("/").length).join("/") })
    }
});

var Project = Vue.extend({
    template: '#project',
    data: function() {
        return {
            project_id: this.$route.params.project_id,
            content: '',
            js_code: '',
            workspace: null,
            requester: { "username": null },
            token: null,
            owner: "",
            is_justblockly: false,
            is_justcode: false,
            saveas: { "name": "", "desc": "" },
            query: "",
            searchResults: [],
            parents: [],
            children: [],
        }
    },
    mounted: function() {
        var workspace = Blockly.inject(this.$refs.blocklyDiv, { toolbox: this.$refs.toolbox });
        this.workspace = workspace
        workspace.addChangeListener(this.onWorkspaceChange);



        this.token = getCookie("token_vikings")
        if (this.token) {
            this.$http.get('/auth/status', {
                headers: {
                    'Authorization': this.token
                }
            }).then(response => {
                this.requester = response.body.data;
                console.log(this.requester.username)
            })
        }
        this.run();
    },
    methods: {
        run: function() {
            this.$http.get('/projects/' + this.project_id, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                res = response.body;

                if (res.status == 'success') {
                    this.parents = res.parents
                    this.children = res.children
                    this.content = res.xml
                    this.owner = res.owner

                    var xml = Blockly.Xml.textToDom(this.content);
                    Blockly.Xml.domToWorkspace(xml, this.workspace);
                    var code = Blockly.JavaScript.workspaceToCode(this.workspace);
                    this.js_code = code;
                } else {
                    console.log("kmlqmke")
                    this.content = 'error'
                }
            })
        },
        search: function() {
            this.$http.post('/search', { "query": this.query }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                this.searchResults = [];
                res = response.body;
                console.log(res)
                projects = res.projects
                users = res.users
                var links = {};
                for (var i = 0; i < projects.length; i++) {
                    this.searchResults.push(projects[i].name)
                    links[projects[i].name] = "projects" + projects[i].id
                }

                for (var i = 0; i < users.length; i++) {
                    this.searchResults.push("User: @" + users[i].username)
                    links["User: @" + users[i].username] = "/user/" + users[i].username
                }

                console.log(this.searchResults)
                $("#searchbox").autocomplete({
                    source: this.searchResults,
                    select: function(event, ui) {
                        router.push({ path: links[ui.item.label] })

                    }
                });

            });
        },
        saveAs: function() {
            var saveas = this.saveas;
            var json = {
                "desc": saveas.desc,
                "name": saveas.name,
                "id": this.project_id
            }
            console.log(saveas.desc, saveas.name, this.project_id);
            this.$http.post('/saveas_project', json, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                }
            }).then(response => {
                res = response.body;
                if (res.status == "success") {
                    alert("saved, redirecting")
                    router.push({ path: `/redirect/project/${res.pid}` })


                } else {
                    alert("failed")
                }

            });

        },
        justblockly: function() {
            if (this.is_justcode) {
                this.un_justcode();
            }
            $("#rightside").removeClass("split");
            $("#rightside").removeClass("left");
            $("#rightside").hide();
            // $("#leftside").css('width', '100%');
            $("#leftside").css('width', '100%');
            Blockly.svgResize(this.workspace);
            this.is_justblockly = true;
        },
        un_justblockly: function() {
            if (this.is_justcode) {
                this.un_justcode();
            }
            // $("#leftside").css('width', '50%');
            $("#leftside").css('width', '50%');
            $("#rightside").addClass("split left");
            $("#rightside").show();
            Blockly.svgResize(this.workspace);
            this.is_justblockly = false;
        },
        justcode: function() {
            if (this.is_justblockly) {
                this.un_justblockly();
            }
            $("#leftside").removeClass("split");
            $("#leftside").removeClass("right");
            $("#leftside").hide();
            $("#rightside").css('width', '100%');
            Blockly.svgResize(this.workspace);
            this.is_justcode = true;
        },
        un_justcode: function() {
            if (this.is_justblockly) {
                this.un_justblockly();
            }
            $("#rightside").css('width', '50%');
            $("#leftside").addClass("split right");
            $("#leftside").show();
            Blockly.svgResize(this.workspace);
            this.is_justcode = false;
        },
        logout: function() {
            eraseCookie('token_vikings');
            alert("logged out!");
            router.go({ name: 'home' })
        },
        run_blocks: function() {
            document.getElementById('id04').style.display = 'block';
            var code = this.js_code;
            eval(code);
            // console.log(code.split("//STEP"))
            code = code.split("//STEP")

        },
        fork_it: function() {
            json = { "id": this.project_id }

            this.$http.post('/fork_project', json, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                }
            }).then(response => {
                res = response.body;
                if (res.status == "success") {
                    alert("forked, redirecting")
                    router.push({ path: `/redirect/project/${res.pid}` });

                } else {
                    alert("failed")
                }

            });
        },
        onWorkspaceChange: function() {
            var code = Blockly.JavaScript.workspaceToCode(this.workspace);
            this.js_code = code;


        },
        save: function() {
            console.log("jmekmwekmew")
            var xml = Blockly.Xml.workspaceToDom(this.workspace);
            var xml_text = Blockly.Xml.domToText(xml);
            json = { "p_id": this.project_id, "content": xml_text }
            console.log(xml_text)
            this.$http.post('/save_project', json, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                }
            }).then(response => {
                body = response.body
                // this.status = body.status
                if (body.status == "success") {
                    alert("saved")
                } else {
                    alert("sth is wrong")
                }

            });
        }
    }
})


var Compare = Vue.extend({
    template: '#compare',
    data: function() {
        return {
            project_id1: this.$route.params.pid1,
            project_id2: this.$route.params.pid2,
            query: "",
            requester: null,
            name1: "",
            name2: "",
            code1: "",
            code2: "",
        }
    },
    mounted: function() {
        this.token = getCookie("token_vikings")
        if (this.token) {
            this.$http.get('/auth/status', {
                headers: {
                    'Authorization': this.token
                }
            }).then(response => {
                this.requester = response.body.data;
            })
        }

        console.log(this.$refs.blocklyDiv)
        
        //get first project's code
        this.$http.get('/projects/' + this.project_id1, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            res = response.body;

            if (res.status == 'success') {
                var workspace1 = Blockly.inject(this.$refs.blocklyDiv, { toolbox: this.$refs.toolbox });
                var xml = Blockly.Xml.textToDom(res.xml);
                Blockly.Xml.domToWorkspace(xml, workspace1);
                var code = Blockly.JavaScript.workspaceToCode(workspace1);
                this.code1 = code;
                this.name1 = res.name;
            } else {
                this.content = 'error'
            }
        })

        this.$http.get('/projects/' + this.project_id2, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            res = response.body;

            if (res.status == 'success') {
                var workspace2 = Blockly.inject(this.$refs.blocklyDiv, { toolbox: this.$refs.toolbox });
                var xml = Blockly.Xml.textToDom(res.xml);
                Blockly.Xml.domToWorkspace(xml, workspace2);
                var code = Blockly.JavaScript.workspaceToCode(workspace2);
                this.code2 = code;
                this.name2 = res.name;
            } else {
                this.content = 'error'
            }
        })

        console.log(this.project_id1)
        console.log(this.project_id2)
    },
    methods: {
        search: function() {
            this.$http.post('/search', { "query": this.query }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                searchResults = [];
                res = response.body;
                console.log(res)
                projects = res.projects
                users = res.users
                var links = {};
                for (var i = 0; i < projects.length; i++) {
                    searchResults.push(projects[i].name)
                    links[projects[i].name] = "projects" + projects[i].id
                }

                for (var i = 0; i < users.length; i++) {
                    searchResults.push("User: @" + users[i].username)
                    links["User: @" + users[i].username] = "/user/" + users[i].username
                }

                $("#searchbox").autocomplete({
                    source: searchResults,
                    select: function(event, ui) {
                        router.push({ path: links[ui.item.label] })

                    }
                });

            });
        },
        logout: function() {
            eraseCookie('token_vikings');
            alert("logged out!");
            router.go({ name: 'home' })
        },
    }
})

const router = new VueRouter({
    routes: [{
            path: '/',
            component: Home,
            name: 'home'
        },
        {
            path: '/project/:project_id',
            component: Project,
            name: 'project'
        },
        {
            path: '/user/:username',
            component: Profile,
            name: 'profile'
        },
        {
            path: '/redirect/*',
            component: Redirect,
            name: 'redirect'
        },
        {
            path: '/compare/:pid1/:pid2',
            component: Compare,
            name: 'compare'
        }
    ]
});

new Vue({
    el: '#app',
    router: router,
    template: '<router-view></router-view>'
});