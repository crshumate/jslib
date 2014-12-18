//Whenever we call jl we want it to create a new instance
var jl = function(selector) {
    return new jl.init(selector);
};


//this is a setter to set page readyState
jl.setReady = function(readyState) {
    this.readyState = readyState;

};


//this is a getter where we check page readyState
jl.isReady = function() {
    return this.readyState;
};

//This is where all the magic happens.
jl.init = function(selector) {



    //if we are ready and not creating a new element...
    if (jl.isReady() && (selector.charAt(0) !== "<" && selector.charAt(selector.length - 1) !== ">")) {
        //default to querySelectorAll - works for all except #id's
        var selectorType = 'querySelectorAll';
        /*if our selector is an id (#) change to getElementById*/
        if (selector.indexOf('#') === 0) {
            selectorType = 'getElementById';
            selector = selector.substr(1, selector.length);
        }

        /*set our selector to jl.init.selector so it is available in return statement*/
        jl.init.selector = document[selectorType](selector);

        //if we are ready and have < > as first and last chars we are creating a new element
    } else if (jl.isReady()) {
        jl.init.selector = document.createElement(selector.replace(/\W/g, ""));

    }



    //helper function for before, after, prepend, and append
    function bapa(status, html, selector) {
        //if this is a dynamically created element we need to access .outerHTML
        if (html.outerHTML) {
            html = html.outerHTML;
        }
        /*if selector does not have a 0 index getElementById was used to find it which means
            we have immediate access to insertAdjacentHTML and other props/funcs
        */
        if (typeof selector[0] === 'undefined') {
            selector.insertAdjacentHTML(status, html);
        } else {
            /*if querySelectorAll was used we need to loop through results to access props/funcs*/
            var length = selector.length;
            for (var i = 0; i < length; i++) {
                selector[i].insertAdjacentHTML(status, html);
            }
        }
    }


    return {

        selector: jl.init.selector,

        ready: function(callback) {
            jl.setReady(false);
            document.addEventListener("DOMContentLoaded", function(event) {
                jl.setReady(true);
                callback();
            });
            return this;
        },
        children: function() {
            if (typeof this.selector[0] === 'undefined') {
                this.selector = this.selector.children;
                //if we don't have access to style property loop through array
            } else {
                var length = this.selector.length;
                var arr = [];
                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < this.selector[i].children.length; j++) {
                        arr.push(this.selector[i].children[j]);
                    }
                }
            }
            this.selector = arr;
            return this;
        },

        style: function(property, value) {
            //if we have access to style this is a getElementById return element
            if (typeof this.selector[0] === 'undefined') {
                this.selector.style[property] = value;
                //if we don't have access to style property loop through array
            } else {
                var length = this.selector.length;
                for (var i = 0; i < length; i++) {
                    this.selector[i].style[property] = value;
                }
            }

            return this;
        },

        before: function(html) {

            bapa('beforebegin', html, this.selector);
            return this;
        },
        after: function(html) {
            bapa('afterend', html, this.selector);
            return this;

        },
        prepend: function(html) {
            bapa('afterbegin', html, this.selector);
            return this;
        },
        append: function(html) {
            bapa('beforeend', html, this.selector);
            return this;
        },
        text: function(text) {
            this.selector.innerText = text;
            return this;
        },
        //special helper function for returning just this.selector
        result: function() {
            return this.selector;
        },
        remove: function() {
            if (typeof this.selector[0] === 'undefined') {
                this.selector.parentNode.removeChild(this.selector);
                //if we don't have access to style property loop through array
            } else {
                var length = this.selector.length;
                for (var i = 0; i < length; i++) {
                    this.selector[i].parentNode.removeChild(this.selector[i]);
                }
            }
        }

    }


};
