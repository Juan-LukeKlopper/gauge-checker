<script>
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	let Emmissions_chart;
	let Incentive_chart;
	let Emission_Donut;
	let Incentive_Donut;
	let Ratio_chart;

	function generateColors(numColors) {
		const colors = [];
		for (let i = 0; i < numColors; i++) {
			const hue = ((i * 360) / numColors) % 360;
			colors.push(`hsl(${hue}, 70%, 60%)`); // Adjust saturation and lightness as needed
		}
		return colors;
	}

	async function fetchData() {
		const response = await fetch(
			"https://bartio-pol-indexer.berachain-devnet.com/berachain/v1alpha1/beacon/vaults",
		);
		const data = await response.json();

		return data.vaults.map((vault) => ({
			name: vault.metadata.name,
			activeIncentives: vault.activeIncentivesInHoney,
			bgtInflationCapture: vault.bgtInflationCapture,
		}));
	}

	onMount(async () => {
		load();
	});

	export async function load() {
		const chartData = await fetchData();
		chartData.sort((a, b) => b.activeIncentives - a.activeIncentives);
		console.log(chartData);

		const numVaults = chartData.length;
		const backgroundColors = generateColors(numVaults);
		const borderColors = backgroundColors.map((color) =>
			color.replace("70%", "100%"),
		);

		const i_ctx = document.getElementById("Incentive_Chart").getContext("2d");
		const e_ctx = document.getElementById("Emmission_Chart").getContext("2d");
		const incentiveDonutCtx = document
			.getElementById("Incentive_Donut")
			.getContext("2d");
		const emissionDonutCtx = document
			.getElementById("Emission_Donut")
			.getContext("2d");
		const ratioBarCtx = document.getElementById("Ratio_chart").getContext("2d");

		const Incentive_data = {
			labels: chartData.map((vault) => vault.name),
			datasets: [
				{
					data: chartData.map((vault) => vault.activeIncentives),
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 2,
				},
			],
		};

		const emmissions_data = {
			labels: chartData.map((vault) => vault.name),
			datasets: [
				{
					label: "BGT emissions",
					data: chartData.map((vault) => vault.bgtInflationCapture),
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 2,
				},
			],
		};

		// Create bar charts
		Incentive_chart = new Chart(i_ctx, {
			type: "bar",
			data: Incentive_data,
			options: {
				responsive: true,
				scales: {
					y: {
						type: "linear",
						beginAtZero: true,
						grid: {
							color: "#DDD",
						},
						ticks: {
							color: "#fff",
						},
					},
					x: {
						grid: {
							color: "#DDD",
						},
						border: {
							color: "#FFF",
						},
						ticks: {
							color: "#fff",
						},
					},
				},
				plugins: {
					legend: {
						display: false,
					},
					title: {
						display: true,
						text: "Active Incentives in Honey.",
						color: "#FFF",
						font: {
							size: 20,
							padding: 5,
							lineHeight: 1.5,
						},
					},
				},
				interaction: {
					axis: "x",
					mode: "nearest",
					intersect: false,
				},
			},
		});

		Emmissions_chart = new Chart(e_ctx, {
			type: "bar",
			data: emmissions_data,
			options: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							color: "#DDD",
						},
						ticks: {
							color: "#fff",
						},
					},
					x: {
						grid: {
							color: "#DDD",
						},
						border: {
							color: "#FFF",
						},
						ticks: {
							color: "#fff",
						},
					},
				},
				plugins: {
					legend: {
						display: false,
					},
					title: {
						display: true,
						text: "Active BGT emmissions.",
						color: "#FFF",
						font: {
							size: 20,
							lineHeight: 1.5,
						},
					},
				},
				interaction: {
					axis: "x",
					mode: "nearest",
					intersect: false,
				},
			},
		});

		// Create donut charts
		Incentive_Donut = new Chart(incentiveDonutCtx, {
			type: "doughnut",
			data: Incentive_data,
			options: {
				responsive: true,
				plugins: {
					legend: {
						labels: {
							boxWidth: 15,
							color: "#FFF",
						},
						position: "top",
					},
					title: {
						display: true,
						text: "Active Incentives in Honey.",
						color: "#FFF",
						font: {
							size: 20,
							lineHeight: 1.5,
						},
					},
				},
			},
		});

		Emission_Donut = new Chart(emissionDonutCtx, {
			type: "doughnut",
			data: emmissions_data,
			options: {
				responsive: true,
				plugins: {
					legend: {
						labels: {
							boxWidth: 15,
							color: "#FFF",
						},
						position: "top",
					},
					title: {
						display: true,
						text: "Active BGT emmissions.",
						color: "#FFF",
						font: {
							size: 20,
							lineHeight: 1.5,
						},
					},
				},
			},
		});

		const ratioData = chartData.map(
			(vault) => vault.activeIncentives / vault.bgtInflationCapture,
		);
		Ratio_chart = new Chart(ratioBarCtx, {
			type: "bar",
			data: {
				labels: chartData.map((vault) => vault.name),
				datasets: [
					{
						label: "Incentive/Emission Ratio",
						data: ratioData,
						backgroundColor: backgroundColors,
						borderColor: borderColors,
						borderWidth: 2,
					},
				],
			},
			options: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							color: "#DDD",
						},
						ticks: {
							color: "#fff",
						},
					},
					x: {
						grid: {
							color: "#DDD",
						},
						border: {
							color: "#FFF",
						},
						ticks: {
							color: "#fff",
						},
					},
				},
				plugins: {
					legend: {
						display: false,
					},
					title: {
						display: true,
						text: "Incentive/Emissions Ratio.",
						color: "#FFF",
						font: {
							size: 20,
						},
					},
					subtitle: {
						display: true,
						text: "Higher is better",
						color: "#FFF",
						font: {
							size: 14,
						},
					},
				},
				interaction: {
					axis: "x",
					mode: "nearest",
					intersect: false,
				},
			},
		});

		function toggleScale(chart, button) {
			const scaleType =
				chart.options.scales.y.type === "linear" ? "logarithmic" : "linear";
			chart.options.scales.y.type = scaleType;
			chart.update();

			button.textContent = `Switch chart to ${scaleType === "linear" ? "Logarithmic" : "Linear"} Scale`;
		}

		function toggleChartType(chart, button) {
			const chartType = chart.options.cutout === "50%" ? "0" : "50%";
			chart.options.cutout = chartType;
			chart.update();

			button.textContent = `Switch chart to ${chartType === "50%" ? "Pie" : "Doughnut"} Chart`;
		}

		// Event Listeners for Buttons
		document
			.getElementById("toggleIncentiveScale")
			.addEventListener("click", () => {
				toggleScale(
					Incentive_chart,
					document.getElementById("toggleIncentiveScale"),
				);
			});

		document
			.getElementById("toggleEmmissionScale")
			.addEventListener("click", () => {
				toggleScale(
					Emmissions_chart,
					document.getElementById("toggleEmmissionScale"),
				);
			});

		document
			.getElementById("toggleRatioScale")
			.addEventListener("click", () => {
				toggleScale(Ratio_chart, document.getElementById("toggleRatioScale"));
			});

		document
			.getElementById("toggleIncentiveType")
			.addEventListener("click", () => {
				toggleChartType(
					Incentive_Donut,
					document.getElementById("toggleIncentiveType"),
				);
			});

		document
			.getElementById("toggleEmmissionType")
			.addEventListener("click", () => {
				toggleChartType(
					Emission_Donut,
					document.getElementById("toggleEmmissionType"),
				);
			});
	}
</script>

<div class="chart-container">
	<p>
		This section has a bar and a pie/doughnut chart to display the active
		incentives in Honey, this means this visually demonstrates how the
		incentives are shared across the vaults
	</p>
	<div class="chart-wrapper">
		<button id="toggleIncentiveScale" class="toggle-button"
			>Switch chart to Logarithmic Scale</button
		>
		<canvas id="Incentive_Chart" class="chart"></canvas>
	</div>
	<div class="chart-wrapper">
		<button id="toggleIncentiveType" class="toggle-button"
			>Switch chart to Pie Chart</button
		>
		<canvas id="Incentive_Donut" class="chart"></canvas>
	</div>
</div>

<div class="chart-container">
	<p>
		This section has a bar and a pie/doughnut chart to display the way
		validators are emmitting their $BGT, this means this visually demonstrates
		how emmissions are shared across the vaults
	</p>
	<div class="chart-wrapper">
		<button id="toggleEmmissionScale" class="toggle-button"
			>Switch chart to Logarithmic Scale</button
		>
		<canvas id="Emmission_Chart" class="chart"></canvas>
	</div>
	<div class="chart-wrapper">
		<button id="toggleEmmissionType" class="toggle-button"
			>Switch chart to Pie Chart</button
		>
		<canvas id="Emission_Donut" class="chart"></canvas>
	</div>
</div>

<div class="chart-container">
	<p>
		This section has a bar chart to display the ratio of Incentives ÷
		Emmissions, this means this visually demonstrates which vaults will return
		the highest amount of incentives per BGT emitted to it across the vaults
	</p>
	<div class="chart-wrapper">
		<button id="toggleRatioScale" class="toggle-button"
			>Switch chart to Logarithmic Scale</button
		>
		<canvas id="Ratio_chart" class="chart"></canvas>
	</div>
</div>
