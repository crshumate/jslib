//Whenever we call jl we want it to create a new instance
var jl = function(selector) {
    return new jl.init(selector);
};
//drop in replacement for jquery
var $ = jl;

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

        //global check to make sure our selected element exists!!
        if (!jl.init.selector || jl.init.selector.length === 0) {
            jl.init.isValid = false;
        } else {
            jl.init.isValid = true;
        }

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

    function addRemoveClass(selector, status, class_name) {
        class_name = class_name.split(",");
        var c_length = class_name.length;
        if (typeof selector[0] === 'undefined') {

            for (var i = 0; i < c_length; i++) {
                if (status === 'add') {
                    selector.className += " " + class_name[i];
                    selector.className = selector.className.trim();
                } else {
                    selector.className = selector.className.replace(class_name[i], '');
                    selector.className = selector.className.trim();
                }
            }


        } else {
            var length = selector.length;
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < c_length; j++) {

                    if (status === 'add') {
                        selector[i].className += " " + class_name[j];
                        selector[i].className = selector[i].className.trim();
                    } else {
                        selector[i].className = selector[i].className.replace(class_name[j], '');
                        selector[i].className = selector[i].className.trim();

                    }
                }


            }
        }
    }

    function eventHandler(selector, event, callback) {

        var event_map = {
            "click": "onclick",
            "mouseenter": "onmouseenter",
            "mouseleave": "onmouseleave",
            "keyup": "onkeyup",
            "keydown": "onkeydown",
            "blur": "onblur",
            "focus": "onfocus"
        };

        if (typeof selector[0] === 'undefined') {
            selector[event_map[event]] = callback;
        } else {
            var length = selector.length;
            for (var i = 0; i < length; i++) {
                selector[i][event_map[event]] = callback;
            }
        }
    }

    function triggerEvent(selector, event) {
        if (typeof selector[0] === 'undefined') {
            selector[event]();
        } else {
            var length = selector.length;
            for (var i = 0; i < length; i++) {
                selector[i][event]();
            }
        }
    }

    var prop = {
        //this.isValid use to make sure our selected element exists!!
        isValid: jl.init.isValid,
        /*selector should be immutable, that is why we have value below..*/
        selector: jl.init.selector,
        /*value is what is populated if we run a method that should return a value, sometimes it is the selector other times it is the computed value based on our */
        value: '',
        addClass: function(class_name) {

            if (!this.isValid) return this;
            addRemoveClass(this.selector, 'add', class_name);
            return this;
        },
        after: function(html) {
            if (!this.isValid) return this;

            bapa('afterend', html, this.selector);
            return this;

        },

        append: function(html) {
            if (!this.isValid) return this;

            bapa('beforeend', html, this.selector);
            return this;
        },

        attr: function(attr, val) {

            if (!this.isValid) return this;

            if (typeof attr === 'undefined') {
                return this;
            }

            if (typeof this.selector[0] === 'undefined') {
                if (!val) {
                    this.value = this.selector.getAttribute(attr);
                } else {
                    this.selector.setAttribute(attr, val);
                }
            } else {
                var length = this.selector.length;
                for (var i = 0; i < length; i++) {
                    if (!val) {
                        this.value = this.selector[0].getAttribute(attr);
                    } else {
                        this.selector[i].setAttribute(attr, val);
                    }
                }
            }

            return this;
        },

        before: function(html) {
            if (!this.isValid) return this;

            bapa('beforebegin', html, this.selector);
            return this;
        },

        blur: function(callback) {
            if (!this.isValid) return this;

            if (callback) {
                eventHandler(this.selector, 'blur', callback)
            } else {
                triggerEvent(this.selector, 'blur');

                return this;
            }
        },
        change: function(callback) {
            if (!this.isValid) return this;
            if (callback) {
                eventHandler(this.selector, 'change', callback);
            } else {
                //TODO: handle triggered Change event..... 
            }
            return this;
        },
        children: function() {

            if (!this.isValid) return this;

            if (typeof this.selector[0] === 'undefined') {
                this.selector = this.selector.children;
                this.value = this.selector;
                //if we don't have access to style property loop through array
            } else {
                var length = this.selector.length;
                var arr = [];
                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < this.selector[i].children.length; j++) {
                        arr.push(this.selector[i].children[j]);
                    }
                }

                this.selector = arr;
                this.value = this.selector;
            }

            return this;
        },
        click: function(callback) {
            if (!this.isValid) return this;
            if (callback) {
                eventHandler(this.selector, 'click', callback)
            } else {
                triggerEvent(this.selector, 'click');

            }

            return this;
        },
        find: function(selector) {

            if (!this.isValid) return this;


            if (typeof this.selector[0] === 'undefined') {
                this.selector = this.selector.querySelectorAll(selector);
                this.value = this.selector;
            } else {
                var arr = [],
                    length = this.selector.length,
                    found_items, fi_length;

                //we may have more than one element matching the main selector
                for (var i = 0; i < length; i++) {
                    found_items = this.selector[i].querySelectorAll(selector);
                    fi_length = found_items.length;
                    //each matching element may have more than match within the find param
                    for (var j = 0; j < fi_length; j++) {
                        arr.push(found_items[j]);
                    }
                }
                this.selector = arr;
                this.value = this.selector;
            }
            return this;
        },
        focus: function(callback) {
            if (!this.isValid) return this;
            if (callback) {
                eventHandler(this.selector, 'focus', callback);
            } else {
                triggerEvent(this.selector, 'focus');

            }
            return this;
        },
        hasClass: function(class_name) {
            if (!this.isValid) return this;

            //default to false
            this.value = false;
            var classes;
            if (typeof this.selector[0] === 'undefined') {

                classes = this.selector.className.split(" ");
            } else {
                classes = this.selector[0].className.split(" ");
            }

            for (var i = 0; i < classes.length; i++) {
                if (classes[i] === class_name) {
                    this.value = true;
                    break;
                }
            }
            return this;
        },
        hover: function(callback1, callback2) {
            if (!this.isValid) return this;
            eventHandler(this.selector, 'mouseenter', callback1);
            eventHandler(this.selector, 'mouseleave', callback2);
            return this;
        },
        keydown: function(callback) {
            if (!this.isValid) return this;
            eventHandler(this.selector, 'keydown', callback);
            return this;
        },
        keyup: function(callback) {
            if (!this.isValid) return this;
            eventHandler(this.selector, 'keyup', callback);
            return this;
        },
        mouseenter: function(callback) {
            if (!this.isValid) return this;
            eventHandler(this.selector, 'mouseenter', callback)
            return this;
        },
        mouseleave: function(callback) {
            if (!this.isValid) return this;
            eventHandler(this.selector, 'mouseleave', callback)
            return this;
        },
        on: function(event, callback) {
            if (!this.isValid) return this;
            eventHandler(this.selector, event, callback)
            return this;
        },
        parent: function() {
            if (!this.isValid) return this;

            if (typeof this.selector[0] === 'undefined') {
                this.selector = this.selector.parentNode;
                this.value = this.selector;
            } else {
                this.selector = this.selector[0].parentNode;
                this.value = this.selector;
            }
            return this;

        },
        style: function(property, value) {

            if (!this.isValid) return this;

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
        prepend: function(html) {
            if (!this.isValid) return this;
            bapa('afterbegin', html, this.selector);
            return this;
        },
        ready: function(callback) {
            jl.setReady(false);
            document.addEventListener("DOMContentLoaded", function(event) {
                jl.setReady(true);
                callback();
            });
            return this;
        },
        remove: function() {

            if (!this.isValid) return this;

            if (typeof this.selector[0] === 'undefined') {
                this.selector.parentNode.removeChild(this.selector);
                //if we don't have access to style property loop through array
            } else {
                var length = this.selector.length;
                for (var i = 0; i < length; i++) {
                    this.selector[i].parentNode.removeChild(this.selector[i]);
                }
            }
        },
        removeAttr: function(attr) {
            if (!this.isValid) return this;
            if (typeof this.selector[0] === 'undefined') {
                this.selector.removeAttribute(attr);
                //if we don't have access to style property loop through array
            } else {
                var length = this.selector.length;
                for (var i = 0; i < length; i++) {
                    this.selector[i].removeAttribute(attr);
                }
            }
            return this;
        },
        removeClass: function(class_name) {
            if (!this.isValid) return this;
            addRemoveClass(this.selector, 'remove', class_name);
            return this;
        },
        result: function() {
            if (!this.isValid) {
                console.error('Invalid Selector. Element does not exist.');
            }
            return this.value;
        },

        text: function(text) {
            if (!this.isValid) return this;

            if (!text) {
                this.value = this.selector.textContent;
            } else {
                this.selector.textContent = text;
            }

            return this;
        }

    }

    return prop;



};
