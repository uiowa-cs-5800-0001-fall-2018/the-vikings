///////// AUX FUNCTIONS //////////

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

///////// END AUX FUNCTIONS //////////

var Home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            login: { 
                "username":"", 
                "password": ""
            },
            register: {
                "email":"", 
                "password": "",
                "username": ""
            },
            msg: "",
            status : "",

        }
    },
    methods: {
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
                    setCookie('token_vikings', 'Bearer '+body.auth_token, 365);
                    setTimeout(function() {
                        router.push({ name: 'profile', params: { username: json.username }})
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
                        setCookie('token_vikings', 'Authorization: Bearer '+body.auth_token, 365);
                        setTimeout(function() {
                            router.push({ name: 'profile', params: { username: json.username }})
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
    data: function(){
        return {
            username: this.$route.params.username,
            token: "",
            requester: null,
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
                console.log(response.body.data)
            })
        }
        
    }
})

var Pen = Vue.extend({
    template: '#pen',
    data: function() {
        return {
            pen_id: this.$route.params.pen_id,
            content: '',
            js_code: '',
            workspace: null
        }
    },
    mounted: function() {
        var workspace = Blockly.inject(this.$refs.blocklyDiv, {toolbox: this.$refs.toolbox});
        this.workspace = workspace
        workspace.addChangeListener(this.onWorkspaceChange);
        
    },
    created: function() {
        this.run();
    },
    methods: {
        run: function() {
            this.$http.get('/pens/'+this.pen_id, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                res = response.body;
                
                if (res.status == 'success') {
                    this.content = res.content
                    var xml = Blockly.Xml.textToDom(this.content);
                    Blockly.Xml.domToWorkspace(xml, this.workspace);
                    var code = Blockly.JavaScript.workspaceToCode(this.workspace);
                    this.js_code = code;
        
                } else {
                    this.content = 'error'
                }
            })
        },
        onWorkspaceChange: function() {
            var code = Blockly.JavaScript.workspaceToCode(this.workspace);
            this.js_code = code;
            
            // var xml = Blockly.Xml.workspaceToDom(workspace);
            // var xml_text = Blockly.Xml.domToText(xml);
            // console.log(xml_text)
        }
    }
})


const router = new VueRouter({
    routes: [{
            path: '/',
            component: Home,
            name: 'home'
        },
        {
            path: '/pen/:pen_id',
            component: Pen,
            name: 'pen'
        },
        {
            path: '/user/:username',
            component: Profile,
            name: 'profile'
        },
    ]
});

new Vue({
    el: '#app',
    router: router,
    template: '<router-view></router-view>'
});