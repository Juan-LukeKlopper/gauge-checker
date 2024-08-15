<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
  
	let Emmissions_chart
	let Incentive_chart
	let Emission_Donut
	let Incentive_Donut
	let Ratio_Donut

	function generateColors(numColors) {
      const colors = [];
      for (let i = 0; i < numColors; i++) {
        const hue = (i * 360 / numColors) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`); // Adjust saturation and lightness as needed
      }
      return colors;
    }

  
	async function fetchData() {
	  const response = await fetch('https://bartio-pol-indexer.berachain-devnet.com/berachain/v1alpha1/beacon/vaults');
	  const data = await response.json();
  
	  return data.vaults.map(vault => ({
		name: vault.metadata.name,
		activeIncentives: vault.activeIncentivesInHoney,
		bgtInflationCapture: vault.bgtInflationCapture
	  }));
	}

	onMount(async () => {
  const chartData = await fetchData();
  chartData.sort((a, b) => b.activeIncentives - a.activeIncentives);
  console.log(chartData);

  const numVaults = chartData.length;
  const backgroundColors = generateColors(numVaults);
  const borderColors = backgroundColors.map(color => color.replace('70%', '100%'));


  const i_ctx = document.getElementById('Incentive_Chart').getContext('2d');
  const e_ctx = document.getElementById('Emmission_Chart').getContext('2d');
  const incentiveDonutCtx = document.getElementById('Incentive_Donut').getContext('2d');
  const emissionDonutCtx = document.getElementById('Emission_Donut').getContext('2d');
  const ratioDonutCtx = document.getElementById('Ratio_Donut').getContext('2d');

  const Incentive_data = {
    labels: chartData.map(vault => vault.name),
    datasets: [{
      data: chartData.map(vault => vault.activeIncentives),
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 2,
	  pointStyle: 'line'
	  
    }]
  };

  const emmissions_data = {
    labels: chartData.map(vault => vault.name),
    datasets: [{
      label: 'BGT emissions',
      data: chartData.map(vault => vault.bgtInflationCapture),
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 2
    }]
  };

  // Create bar charts
  Incentive_chart = new Chart(i_ctx, {
    type: 'bar',
    data: Incentive_data,
    options: {
      responsive: true,
      scales: {
        y: {
          type: 'logarithmic',
          beginAtZero: true
        }
      },
	  plugins: {
        legend: {
          labels: {
			boxWidth: 15,
          },
        }
      }
	}
    });

  Emmissions_chart = new Chart(e_ctx, {
    type: 'bar',
    data: emmissions_data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
	  plugins: {
        legend: {
          labels: {
			boxWidth: 15,
          },
        }
      }
    }
  });

  // Create donut charts
  new Chart(incentiveDonutCtx, {
    type: 'doughnut',
    data: Incentive_data,
    options: {
      responsive: true,
	  plugins: {
        legend: {
          labels: {
			boxWidth: 15,
          },
		  position: 'left',
        }
      }
    }
  });

  new Chart(emissionDonutCtx, {
    type: 'doughnut',
    data: emmissions_data,
    options: {
      responsive: true,
	  plugins: {
        legend: {
          labels: {
			boxWidth: 15,
          },
		  position: 'left',
        }
      }
    }
  });

  const ratioData = chartData.map(vault => vault.activeIncentives / vault.bgtInflationCapture);
  new Chart(ratioDonutCtx, {
    type: 'doughnut',
    data: {
      labels: chartData.map(vault => vault.name),
      datasets: [{
        label: 'Incentive/Emission Ratio',
        data: ratioData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
	  plugins: {
        legend: {
          labels: {
			boxWidth: 15,
          },
		  position: 'left',
        }
      }
    }
  });
});

  </script>
  
	<canvas id="Incentive_Chart" class="chart"></canvas>
	<canvas id="Emmission_Chart" class="chart"></canvas>
  <canvas id="Incentive_Donut" class="chart"></canvas>
	<canvas id="Emission_Donut" class="chart"></canvas>
	<canvas id="Ratio_Donut" class="chart"></canvas>

  
  
  <style>
	.chart {
	  max-width: 1200px;
	  margin: auto;
	}
  </style>
  