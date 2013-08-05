function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';    
        
    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    
    return parent;
}

ko.bindingHandlers.rightClick = {
    init: function(element, valueAccessor) {
		$(element).on('mousedown', function(event) {
			if(event.which==3) valueAccessor()();
		}).on('contextmenu', function(event) {
			event.preventDefault();
		});
    }
};
ko.bindingHandlers.middleClick = {
    init: function(element, valueAccessor) {
		$(element).on('mousedown', function(event) {
			if(event.which==2) valueAccessor()();
		});
    }
};