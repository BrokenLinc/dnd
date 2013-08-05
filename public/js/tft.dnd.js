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

			self.stats = ko.computed(function(){
				var totals = {};
				ko.utils.arrayForEach(self.skills(), function(skill){
					var p = skill.points();
					if(p>0) ko.utils.arrayForEach(skill.stats, function(stat){
						var total = totals[stat.title] || 0;
						total += stat.value * p;
						totals[stat.title] = total;
					});
				});
				var result = [];
				for(var statName in totals) {
					result.push({
						title:statName
						, value:totals[statName]
					});
				}
				return result;
			});
			self.newbMode = function(){
				ko.utils.arrayForEach(self.skills(), function(skill){
					skill.points(0);
				});
			};
			self.godMode = function(){
				ko.utils.arrayForEach(self.skills(), function(skill){
					skill.points(skill.maxPoints);
				});
			};

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
			self.stats = e.stats || [];

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
				if(!self.dependenciesFulfilled()){
					var s = [];
					ko.utils.arrayForEach(self.dependencies(), function(item) {
						if(!item.hasMaxPoints()) s.push(item.title);
					});
					return 'Learn ' + s.join(', ') + ' to unlock.'
				}
				return '';
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
		var vm = new tft.dnd.TalentTree(tft.dnd.data);
		ko.applyBindings(vm);
	});

})(window.jQuery, window.ko);