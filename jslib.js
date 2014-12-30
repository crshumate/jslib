//Whenever we call jl we want it to create a new instance
var jl = function(selector) {
    return new jl.init(selector);
};
//drop in replacement for jquery
var $ = jl;

jl.ajax = function(params, fn) {
    var res;
    params.type = params.type || 'text';


    var xhr = new XMLHttpRequest();
    xhr.open(params.method, encodeURI(params.url));
    xhr.onload = function() {
        if (xhr.status === 200) {
            res = xhr.responseText;
            if(params.type==='JSON'){
               res =  JSON.parse(xhr.responseText)
            }
            fn(res);
        } else {
            fn(xhr.status);
        }
    };
    xhr.send();


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

        //global check to make sure our selected element exists!!
        if (!jl.init.selector || jl.init.selector.length === 0) {
            jl.init.isValid = false;
            jl.init.value = '';
        } else {
            jl.init.isValid = true;
            jl.init.value = jl.init.selector;
        }

        //if we are ready and have < > as first and last chars we are creating a new element
    } else if (jl.isReady()) {
        jl.init.selector = document.createElement(selector.replace(/\W/g, ""));
        jl.init.value = jl.init.selector;

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
        if (this.selector.nodeType) {
            selector.insertAdjacentHTML(status, html);
        } else {
            /*if querySelectorAll was used we need to loop through results to access props/funcs*/
            each(this.selector, function(selector) {
                selector.insertAdjacentHTML(status, html);
            });


        }
    }

    function addRemoveClass(selector, status, class_name) {
        class_name = class_name.split(",");

        if (this.selector.nodeType) {
            each(class_name, function(class_name) {
                getSetClass(selector, status, class_name);
            });


        } else {
            each(this.selector, function(selector) {
                each(class_name, function(class_name) {
                    getSetClass(selector, status, class_name);
                });
            });
        }

        function getSetClass(selector, status, class_name) {
            if (status === 'add') {
                selector.className += " " + class_name;
                selector.className = selector.className.trim();
            } else {
                class_name = new RegExp(class_name, "g");
                selector.className = selector.className.replace(class_name, '');
                selector.className = selector.className.trim();

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

        if (this.selector.nodeType) {
            selector[event_map[event]] = callback;
        } else {
            each(this.selector, function(selector) {
                selector[event_map[event]] = callback;
            });


        }
    }

    function triggerEvent(selector, event, callback) {
        if (this.selector.nodeType) {
            if (event === 'change') {
                if (selector.value && selector.value !== '') {
                    selector.value = this.value;
                }

            } else {
                selector[event]();
                if (callback) callback();
            }


        } else {
            each(this.selector, function(selector) {
                if (event === 'change') {
                    if (selector.value && selector.value !== '') {
                        selector.value = this.value;
                    }
                } else {
                    selector[event]();
                    if (callback) callback();
                }
            });

        }
    }

    function each(arr, callback) {
        for (var i = 0; i < arr.length; i++) {
            if (!callback(arr[i], i)) {
                break;
            }

        }
    }

    var prop = {
        //this.isValid use to make sure our selected element exists!!
        isValid: jl.init.isValid,
        /*selector should be immutable, that is why we have value below..*/
        selector: jl.init.selector,
        /*value is what is populated if we run a method that should return a value, sometimes it is the selector other times it is the computed value based on our */
        value: jl.init.value,
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

            if (this.selector.nodeType) {
                if (!val) {
                    this.value = this.selector.getAttribute(attr);
                } else {
                    this.selector.setAttribute(attr, val);
                }
            } else {

                if (!val) {
                    this.value = this.selector[0].getAttribute(attr);
                } else {
                    each(this.selector, function(selector) {
                        selector.setAttribute(attr, val);
                    });
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
        children: function() {

            if (!this.isValid) return this;

            if (this.selector.nodeType) {
                this.selector = this.selector.children;
                this.value = this.selector;
                //if we don't have access to style property loop through array
            } else {
                var arr = [];
                each(this.selector, function(selector) {
                    each(selector.children, function(child) {
                        arr.push(child);
                    })
                });
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
        find: function(input_selector) {

            if (!this.isValid) return this;


            if (this.selector.nodeType) {
                this.selector = this.selector.querySelectorAll(input_selector);
                this.value = this.selector;
            } else {
                var arr = [],
                    found_items;

                //we may have more than one element matching the main selector
                each(this.selector, function(selector) {
                    found_items = selector.querySelectorAll(input_selector);
                    each(found_items, function(found_item) {
                        arr.push(found_item);
                    });
                });

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
            //assigning that to this so we can reach inside of callback to assign true value..
            var that = this;
            //default to false
            this.value = false;
            var classes;
            if (this.selector.nodeType) {

                classes = this.selector.className.split(" ");
            } else {
                classes = this.selector[0].className.split(" ");
            }
            each(classes, function(r_class) {
                if (r_class === class_name) {
                    that.value = true;
                    return false;
                }
            });

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

            if (this.selector.nodeType) {
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
            if (this.selector.nodeType) {
                this.selector.style[property] = value;
                //if we don't have access to style property loop through array
            } else {
                each(this.selector, function(selector) {
                    selector.style[property] = value;
                });
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

            if (this.selector.nodeType) {
                this.selector.parentNode.removeChild(this.selector);
                //if we don't have access to style property loop through array
            } else {
                each(this.selector, function(selector) {
                    selector.parenNode.removeChild(selector);
                });
            }
        },
        removeAttr: function(attr) {
            if (!this.isValid) return this;
            if (this.selector.nodeType) {
                this.selector.removeAttribute(attr);
                //if we don't have access to style property loop through array
            } else {
                each(this.selector, function() {
                    selector.removeAttribute(attr);
                });
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
            if (this.selector.nodeType) {
                getSetText(this.selector, this, text);
            } else {
                if (!text) {
                    getSetText(this.selector[0], this);
                } else {
                    each(this.selector, function(selector) {
                        getSetText(selector, false, text);
                    });
                }

            }

            function getSetText(selector, lib, text) {
                if (!text) {
                    lib.value = selector.textContent;
                } else {
                    selector.textContent = text;
                }
            }

            return this;
        },
        trigger: function(event, callback) {
            if (!this.isValid) return this;
            triggerEvent(this.selector, event, callback);
            return this;
        },
        val: function(value) {
            var that = this;
            if (!this.isValid) return this;
            if (this.selector.nodeType) {

                //if this.selector doesn't have a value property
                if (!this.selector.value) return this;
                //if truthy we have a value to set...
                if (value) {
                    this.selector.value = value;
                    this.value = value;
                    //else: we are getting a value...
                } else {
                    this.value = this.selector.value;
                }

            } else {
                each(this.selector, function(selector, i) {
                    /*if this element doesn't have a value prop continue to next item */
                    if (!selector.value) return;
                    if (value) {
                        that.value = value;
                        selector.value = value;
                    } else {
                        if (i === 0) {
                            that.value = selector.value;
                        }
                    }
                });

            }
            return this;
        }

    }

    return prop;



};
