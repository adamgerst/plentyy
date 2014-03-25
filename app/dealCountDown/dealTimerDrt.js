plentyyApp.directive('dealTimer', function($interval, $filter){	
	return  function(scope, element, attrs){
  var dateFilter = $filter('date');
  var test;

  var endTime = new Date(scope.deal.endDateTime).getTime();

  function updateTime(){
    var now = new Date().getTime();
    var remaining = parseInt((endTime -now)/60000);

    var mins = remaining % 60;
    var hrs = Math.floor(parseInt(remaining / 60));

    if (mins < 10){
      mins = "0" + mins;
    }

    var minDisplay = "<span>" + mins + "</span><span id='time-min'> min </span>";	
    var hrDisplay =  "<span>" + hrs + "</span><span id='time-hr'> hr </span>" 

    if (hrs === 0 ) {
      var timeDisplay =  minDisplay
    }else {
      var timeDisplay = hrDisplay + minDisplay;
    }

    element.html(timeDisplay);
    };

    $interval(updateTime, 1000);
    };
});
