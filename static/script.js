var Home = Vue.extend({
    template: '#home'
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
        }
    ]
});

new Vue({
    el: '#app',
    router: router,
    template: '<router-view></router-view>'
});