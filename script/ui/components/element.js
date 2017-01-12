UI.element = function(left,top,width,height){
    var me = {};

    me.left = left || 0;
    me.top = top || 0;
    me.width = width || 20;
    me.height = height || 20;

    me.visible = true;
    me.needsRendering = true;
    me.parentCtx = ctx;

    me.canvas = document.createElement("canvas");
    me.canvas.width = width;
    me.canvas.height = height;
    me.ctx = me.canvas.getContext("2d");
    me.children = [];

    me.hide = function(){
        me.visible = false;
    };
    me.show = function(andRefresh,andRefreshAllChildren){
        me.visible = true;
        if (andRefresh) me.refresh(andRefreshAllChildren);
    };

    me.isVisible = function(){
        var result = me.visible;
        var parent = me.parent;
        while (result && parent) {
            result = parent.visible;
            parent = parent.parent;
        }
        return result;
    };

    me.containsPoint = function(x,y){
        var left = this.left;
        var right = this.left+this.width;
        var top = this.top;
        var bottom = this.top+this.height;

        return ((x >= left) && (x <= right) && (y >= top) && (y <= bottom));
    };

    me.getElementAtPoint = function(_x,_y){
        _x -= me.left;
        _y -= me.top;
        var currentEventTarget;
        for (var i = me.children.length-1; i>=0; i--){
            var elm = me.children[i];
            if (elm.isVisible() && !elm.ignoreEvents && elm.containsPoint(_x,_y)){
                currentEventTarget = elm;
                break;
            }
        }

        if (currentEventTarget){
            var child = currentEventTarget.getElementAtPoint(_x,_y);
            if (child){
                currentEventTarget = child;
            }else{
                currentEventTarget.eventX = _x;
                currentEventTarget.eventY = _y;
            }
        }else{
            currentEventTarget = me;
            currentEventTarget.eventX = _x;
            currentEventTarget.eventY = _y;
        }



        return currentEventTarget;
    };

    me.setParent = function(parentElement){
        me.parent = parentElement;
        if (parentElement){
            me.parentCtx = parentElement.ctx;
        }
    };

    me.addChild = function(elm){
        elm.setParent(me);
        me.children.push(elm);
    };

    me.getChild = function(name){
        var i = me.children.length;
        var child;
        while (i){
            child = me.children[i];
            if (child && child.name && child.name == name) return child;
            i--;
        }
    };

    me.refresh = function(refreshChildren){
        me.needsRendering = true;
        if (refreshChildren){
            console.error("refresh children " + me.name);
            var i = me.children.length;
            var child;
            while (i){
                child = me.children[i];
                if (child) child.refresh();
                i--;
            }
        }
        if (this.visible && me.parent) me.parent.refresh();
    };

    me.setSize = function(_w,_h){
        me.width = _w;
        me.height = _h;
        me.canvas.width = me.width;
        me.canvas.height = me.height;
        me.refresh();
    };
    me.setPosition = function(_x,_y){
        me.left = _x;
        me.top = _y;
        me.refresh();
    };

    me.clearCanvas = function(){
        me.ctx.clearRect(0,0,me.width,me.height);
    };

    return me;
};