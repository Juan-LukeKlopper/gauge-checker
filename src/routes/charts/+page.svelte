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
          type: 'linear',
          beginAtZero: true
        }
      },
	  plugins: {
        legend: {
		  display: false,
        },
		title: {
          display: true,
          text: 'Active Incentives in Honey.',
		  font: {
            size: 20,
		  },
        }
      },
	  interaction: {
		axis: 'x',
		mode: 'nearest',
		intersect: false,
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
		  display: false,
        },
		title: {
          display: true,
          text: 'Active BGT emmissions.',
		  font: {
            size: 20,
		  },
        }
	  },
	    interaction: {
		  axis: 'x',
		  mode: 'nearest',
		  intersect: false,
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
        },
		title: {
          display: true,
          text: 'Active Incentives in Honey.',
		  font: {
            size: 20,
		  },
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
        },
		title: {
          display: true,
          text: 'Active BGT emmissions.',
		  font: {
            size: 20,
		  },
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
        },
		title: {
          display: true,
          text: 'Incentive/Emmissions ratio.',
		  font: {
            size: 20,
		  },
        },
		subtitle: {
			display: true,
			text: 'Higher is better',
			font: {
			  size: 14,
			}
		},
      }
    }
  });

  function toggleScale(chart, button) {
    const scaleType = chart.options.scales.y.type === 'linear' ? 'logarithmic' : 'linear';
    chart.options.scales.y.type = scaleType;
    chart.update();

    button.textContent = `Switch chart to ${scaleType === 'linear' ? 'Logarithmic' : 'Linear'} Scale`;
  }

  // Event Listeners for Buttons
  document.getElementById('toggleIncentiveScale').addEventListener('click', () => {
    toggleScale(Incentive_chart, document.getElementById('toggleIncentiveScale'));
  });

  document.getElementById('toggleEmmissionScale').addEventListener('click', () => {
    toggleScale(Emmissions_chart, document.getElementById('toggleEmmissionScale'));
  });
});

  </script>
  
  <div class="chart-container">
	<div>
  	  <button id="toggleIncentiveScale" class="toggle-button">Switch chart to Logarithmic Scale</button>
	</div>
	<canvas id="Incentive_Chart" class="chart"></canvas>
	<canvas id="Incentive_Donut" class="chart"></canvas>
  </div>

  <div class="chart-container">
	<div>
	  <button id="toggleEmmissionScale" class="toggle-button">Switch chart to Logarithmic Scale</button>
	</div>
	<canvas id="Emmission_Chart" class="chart"></canvas>
	<canvas id="Emission_Donut" class="chart"></canvas>
  </div>

  <div class="chart-container">
	<canvas id="Ratio_Donut" class="chart"></canvas>
  </div>


  
  
  <style>
	.chart-container {
	  display: flex;
	  justify-content: space-between;
	  flex-wrap: wrap;
	  margin-bottom: 20px;
	}

	.chart {
	  flex: 1 1 45%; /* Each chart takes up 45% of the container's width */
	  max-width: 700px; /* Maximum width for each chart */
	  margin: 10px;
	}

	@media (max-width: 1200px) {
	.chart {
	  flex: 1 1 100%; /* On smaller screens, each chart takes up full width */
	}
	}

	.toggle-button {
	  display: block;
	  margin: 10px auto;
	  padding: 8px 16px;
	  background-color: #4CAF50;
	  color: white;
	  border: none;
	  cursor: pointer;
	  font-size: 14px;
	  border-radius: 4px;
	}

	.toggle-button:hover {
  	  background-color: #45a049;
	}

  </style>
  