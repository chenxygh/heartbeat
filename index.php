<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<title>Dashboard &laquo; Admin</title>
	<link rel="stylesheet" href="/static/assets/vendors/bootstrap/css/bootstrap.css">
	<link rel="stylesheet" href="/static/assets/vendors/font-awesome/css/font-awesome.css">
	<link rel="stylesheet" href="/static/assets/vendors/nprogress/nprogress.css">
	<link rel="stylesheet" href="/static/assets/css/admin.css">
	<style>
	canvas {
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	</style>
	<script src="/static/assets/vendors/nprogress/nprogress.js"></script>
</head>
<body>
	<script>NProgress.start()</script>
	<div class="main">
		<?php include_once 'admin/inc/navbar.html'; ?>
		<div class="container-fluid">
			<div class="col-md-4">
				<canvas id="chart-area"></canvas>
			</div>
		</div>
	</div>
	
	<?php include_once 'admin/inc/aside.html'; ?>

	<script src="/static/assets/vendors/jquery/jquery.js"></script>
	<script src="/static/assets/vendors/bootstrap/js/bootstrap.js"></script>
	<script src="/static/assets/vendors/chart/chart.js"></script>

	<script>
		$(function () {
			var config = {
				type: 'line',
				data: {
					datasets: [{
						label: 'Dataset with category data',
						data: [
						983,
						218,
						9,
						488,
						78
						],
						backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)'
						],
					}],
				},
				options: {
					scales: {
						xAxes: [{
			                type: 'category',
			                labels: ['January', 'February', 'March', 'April', 'May']
			            }]
					}
				}
			};

			window.onload = function() {
				var ctx = document.getElementById('chart-area').getContext('2d');
				window.myPie = new Chart(ctx, config);
			};
		});
	</script>


	<script>NProgress.done()</script>
</body>
</html>
