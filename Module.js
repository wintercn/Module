

void function(){
    function Enviorment() {
        var source ="";

        this.host = function () {
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.documentElement.appendChild(iframe);
            //iframe.src = "about:blank";
            iframe.contentWindow.Module = Module;
            setTimeout(function () {
                //document.documentElement.removeChild(iframe);
            }, 20);
            iframe.contentWindow.global = window;
            iframe.contentWindow.host = iframe.contentWindow;
            return iframe.contentWindow;
        }();

        this.loadFromUriAsync = function (callback) {

        };
        this.loadFromUri = function (uri) {
            var request = new XMLHttpRequest();
            request.open("GET", uri, false);
            request.send(null);
            source += request.responseText;
        };
        this.exec = function () {
            this.host.eval("with(global) void function() { " + source + " \n\nthis.access = function access(varName,value){ var eval = this.eval; if(arguments.length==2) return eval(varName+'=value'); else return eval(varName);}; }()");
        };
    }


    function Module() {
        this.enviorment = new Enviorment();
        this.export = function () {
            var variableList = Array.prototype.slice.call(arguments);
            var module = this;
            variableList.forEach(function (propertyName) {
                Object.defineProperty(module,propertyName,{
                    get:function(){
                        return this.enviorment.host.access(propertyName);
                    },
                    set:function(v){                        
                        return this.enviorment.host.access(propertyName,v);
                    }
                })
            });
            return this;
        }
        var fileList = Array.prototype.slice.call(arguments);
        var module = this;

        fileList.forEach(function (file) {
            module.enviorment.loadFromUri(file);
        });
        module.enviorment.exec();
    }

    window.Module = Module;
}();