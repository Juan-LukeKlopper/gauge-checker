<script>
	import { onMount } from "svelte";
	let vaults = [];
	let selectedVaults = [];
	let ratios = {};
	let totalRatio = 10000;
	let currentBlockNumber = 0;

	// Use your existing fetchData function
	async function fetchData() {
		const response = await fetch(
			"https://bartio-pol-indexer.berachain-devnet.com/berachain/v1alpha1/beacon/vaults",
		);
		const data = await response.json();

		return data.vaults.map((vault) => {
			const activeIncentives =
				vault.activeIncentivesInHoney || 0;
			const bgtInflationCapture =
				vault.bgtInflationCapture || 1; // Avoid dividing by 0

			return {
				name: vault.metadata.name,
				address: vault.vaultAddress,
				activeIncentives,
				bgtInflationCapture,
				ratio:
					activeIncentives /
					(bgtInflationCapture || 1), // Use 1 if bgtInflationCapture is 0
			};
		});
	}

	async function fetchBlockNumber() {
		const response = await fetch(
			"https://cdn.testnet.routescan.io/api/evm/80084/sync?",
		);
		const data = await response.json();
		currentBlockNumber = data.blockCount;
	}

	// Load the data on mount
	onMount(async () => {
		vaults = await fetchData();

		vaults.sort((a, b) => b.ratio - a.ratio);

		await fetchBlockNumber();
	});

	function handleVaultSelection(vault) {
		if (selectedVaults.includes(vault)) {
			selectedVaults = selectedVaults.filter(
				(v) => v !== vault,
			);
		} else {
			selectedVaults.push(vault);
		}
	}

	function handleRatioChange(vault, ratio) {
		ratios[vault.name] = ratio;
		const total = Object.values(ratios).reduce(
			(sum, r) => sum + r,
			0,
		);
		if (total > totalRatio) {
			ratios[vault.name] = totalRatio - (total - ratio);
		}
	}

	function generateCommand() {
		const futureBlock = currentBlockNumber + 100;
		const vaultData = selectedVaults.map((vault) => ({
			address: vault.address,
			ratio: ratios[vault.name] || 0,
		}));

		const command = `cast send 0xfb81E39E3970076ab2693fA5C45A07Cc724C93c2 "queueNewCuttingBoard(address,uint64,(address,uint96)[])" 0xeC6d3f350BcdCe0F451D52e69f61Bf3630240B66 ${futureBlock} '[${vaultData.map((v) => `(${v.address},${v.ratio})`).join(",")}]' --rpc-url https://testnet-berav2.brightlystake.com --private-key <PRIVATEKEY>`;
		console.log(command);
	}
</script>

<div>
	<h1>Cutting Board</h1>
	<div>
		{#each vaults as vault}
			<div>
				<input
					type="checkbox"
					on:change={() =>
						handleVaultSelection(vault)}
				/>
				<label
					>{vault.name} - Emissions/Incentives Ratio:
					{(
						vault.activeIncentives /
						vault.bgtInflationCapture
					).toFixed(2)}</label
				>
				{#if selectedVaults.includes(vault)}
					vault.activeIncentives type="range"
					min="0" max={totalRatio}
					value={ratios[vault.name] || 0}
					on:input={(e) =>
						handleRatioChange(
							vault,
							+e.target.value,
						)}
					/>
					<span>{ratios[vault.name] || 0}</span>
				{/if}
			</div>
		{/each}
	</div>
	<button on:click={generateCommand}>Generate Command</button>
</div>
