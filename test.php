<?php
	error_reporting(E_ALL); 
	ini_set("display_errors", 1);
	require('../functions.php');
	
	$website['title'] = 'Datepicker';
	$website['description'] = 'Datepicker';
	$website['author'] = 'Jorge Benavides';
	$website['keywords'] = 'HTML,CSS,XML,JavaScript,PHP,iOS,Android,Mobile,Website';
	
	$agent_mobile = preg_match('/ipad|iphone|android|mobile/i', ($_SERVER['HTTP_USER_AGENT']));
	$agent_apple = preg_match('/apple|machintosh/i', ($_SERVER['HTTP_USER_AGENT']));
	
?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
	<head>
		<title><?php echo $website['title'] ?></title>
		<meta name="charset" charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<meta name="description" content="<?php echo $website['description'] ?>"/>
		<meta name="author" content="<?php echo $website['author'] ?>"/>
		<meta name="keywords" content="<?php echo $website['keywords'] ?>"/>
		
		<link href="../bootstrap/v4/bootstrap.min.css" rel="stylesheet" media="screen" />
		<link href="./Source/css/JBCalendar.css?th=<?php echo time() ?>" rel="stylesheet" media="screen" />
		<link href="./Source/css/JBClock.css?th=<?php echo time() ?>" rel="stylesheet" media="screen" />
		<script type="text/javascript" src="./Source/js/JBTools.js?th=<?php echo time() ?>"></script>
		<script type="text/javascript" src="./Source/js/JBCalendar.js?th=<?php echo time() ?>"></script>
		<script type="text/javascript" src="./Source/js/JBClock.js?th=<?php echo time() ?>"></script>
		<script type="text/javascript" src="./Source/js/JBDatePicker.js?th=<?php echo time() ?>"></script>
		<style>
			input {
				display: block;
				padding: 2px 10px;
			}
		</style>
		<script>
			function main() {
				JBTools.each(document.querySelectorAll('.calendar-example'), function(el, i) {
					//new JBCalendar(el);
				});
				JBTools.each(document.querySelectorAll('.week-example'), function(el, i) {
					var week_calendar = new JBCalendar(el, { type :'week' });
				});
			}
		</script>
	</head>
	<body onload="main();">
		<div id="content">
			<div class="container my-3">
				<legend>Or just use individual objects</legend>
				<div class="row">
					<div class="col-md-6">
						<h2>Calendar</h2>
						<div class="calendar-example">
						</div>
						<h2>Week</h2>
						<div class="week-example">
						</div>
						<h2>Day</h2>
						<div class="day-example">
						</div>
						<h2>Clock</h2>
						<div class="clock-example">
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>