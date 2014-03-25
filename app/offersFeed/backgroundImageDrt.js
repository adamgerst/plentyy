plentyyApp.directive('ngBackground', function(dealDataService){
	return function(scope, element, attrs){

		attrs.$observe('ngBackground', function(dealId){
      dealDataService.getImageById(dealId)
      .then(function(dataImage) {
        element.css({
          'background-image': 'url(' + dataImage +')',
          'background-size' : 'cover'
        });
      });
		});
	}
});
