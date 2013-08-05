(function(){
	(function(ns) {
		ns.data = {
			skills: [
				{
					id: 1
					, title: 'HTML'
					, description: 'The main language for creating web pages, written in the form of tags enclosed in angle brackets (like <html>).'
					, links:[
						{
							label: 'w3schools.com HTML Tutorial'
							, url: 'http://www.w3schools.com/html/'
						}
					]
					, stats: [
						{
							title: 'Intellect'
							, value: 10
						}
					]
				},
				{
					id: 2
					, title: 'CSS'
					, dependsOn: [1]
					, maxPoints: 3
					, stats: [
						{
							title: 'Charisma'
							, value: 3
						}
					]
				},
				{
					id: 3
					, title: 'jQuery'
					, dependsOn: [2]
					, stats: [
						{
							title: 'Charisma'
							, value: 5
						}
						,{
							title: 'Intellect'
							, value: 5
						}
					]
				},
				{
					id: 4
					, title: 'KnockoutJS'
					, dependsOn: [2]
					, maxPoints: 5
					, stats: [
						{
							title: 'Charisma'
							, value: 4
						}
						,{
							title: 'Nimble toes'
							, value: 8
						}
					]
				},
				{
					id: 5
					, title: 'Thingie 5'
					, dependsOn: [3, 4]
				}
			]
		}
	})(namespace('tft.dnd'));
})();