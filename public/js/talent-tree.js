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

(function($, ko){

	(function(ns) {
		var TalentTree = ns.TalentTree = function(_e){
			var e = _e || {};
			var self = function(){};

			function getSkillById(id) {
				return ko.utils.arrayFirst(self.skills(), function(item){
					return item.id == id;
				});
			}

			self.skills = ko.observableArray(ko.utils.arrayMap(e.skills, function(item){
				return new Skill(item, self.skills);
			}));

			ko.utils.arrayForEach(e.skills, function(item){
				if(item.dependsOn) {
					var dependent = getSkillById(item.id);
					ko.utils.arrayForEach(item.dependsOn, function(dependencyId){
						var dependency = getSkillById(dependencyId);
						dependent.dependencies.push(dependency);
						dependency.dependents.push(dependent);
					});
				}
			});

			return self;
		}
		var Skill = ns.Skill = function(_e, allSkills){
			var e = _e || {};
			var self = function(){};

			self.id = e.id || 0;
			self.title = e.title || 'Unknown Skill';
			self.description = e.description;
			self.maxPoints = e.maxPoints || 1;
			self.points = ko.observable(e.points || 0);
			self.links = ko.utils.arrayMap(e.links, function(item){
				return new Link(item);
			});
			self.dependencies = ko.observableArray([]);
			self.dependents = ko.observableArray([]);

			self.hasDependencies = ko.computed(function(){
				return self.dependencies().length > 0;
			});
			self.dependenciesFulfilled = ko.computed(function(){
				var result = true;
				ko.utils.arrayForEach(self.dependencies(), function(item) {
					if(!item.hasMaxPoints()) result = false;
				});
				return result;
			});
			self.dependentsUsed = ko.computed(function(){
				var result = false;
				ko.utils.arrayForEach(self.dependents(), function(item) {
					if(item.hasPoints()) result = true;
				});
				return result;
			});
			self.hasPoints = ko.computed(function(){
				return self.points() > 0;
			});
			self.hasMaxPoints = ko.computed(function(){
				return self.points() >= self.maxPoints;
			});
			self.canAddPoints = ko.computed(function(){
				return self.dependenciesFulfilled() && !self.hasMaxPoints();
			});
			self.canRemovePoints = ko.computed(function(){
				return !self.dependentsUsed() && self.hasPoints();
			});
			self.helpMessage = ko.computed(function(){
				return 'Here is some help text.';
			});
			self.addPoint = function() {
				if(self.canAddPoints()) self.points(self.points() + 1);
			}
			self.removePoint = function() {
				if(self.canRemovePoints()) self.points(self.points() - 1);
			}

			return self;
		}
		var Link = ns.Link = function(_e){
			var e = _e || {};
			var self = function(){};

			self.label = e.label || (e.url || 'Learn more');
			self.url = e.url || 'javascript:void(0)';

			return self;
		}
	})(namespace('tft.dnd'));


	$(function(){
		var vm = new tft.dnd.TalentTree({
			skills: [
				{
					id: 1
					, title: 'Thingie 1'
					, links:[
						{
							label: 'Learn more'
							, url: 'http://www.google.com/i'
						}
					]
				},
				{
					id: 2
					, title: 'Thingie 2'
					, dependsOn: [1]
					, maxPoints: 3
				},
				{
					id: 3
					, title: 'Thingie 3'
					, dependsOn: [2]
				},
				{
					id: 4
					, title: 'Thingie 4'
					, dependsOn: [2]
					, maxPoints: 5
				},
				{
					id: 5
					, title: 'Thingie 5'
					, dependsOn: [3, 4]
				}
			]
		});
		ko.applyBindings(vm);
	});

})(window.jQuery, window.ko);