

void function(){
    function Enviorment() {
        this.host = function () {

                var iframe = document.createElement("iframe");
                iframe.style.display = "none";
                document.documentElement.appendChild(iframe);
                iframe.src = "about:blank";                
                return iframe.contentWindow;
                setTimeout(function () {
                    document.documentElement.removeChild(iframe);
                }, 0)
                

        }();

        this.loadFromUriAsync = function (callback) {

        };
        this.loadFromUri = function (uri) {
            var request = new XMLHttpRequest();
            request.open("GET", uri, false);
            request.send(null);
            this.host.eval(request.responseText);
        };
        this.exec = function (source) {
            this.host.eval(source);
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
                        return this.enviorment.host[propertyName];
                    },
                    set:function(v){                        
                        return this.enviorment.host[propertyName] = v;
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
    }

    window.Module = Module;
}();