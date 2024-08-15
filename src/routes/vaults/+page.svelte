<script>
import Validators from '$lib/components/Validators.svelte';
let selectedVault = null;
let vaults;

let promise = getValueGauges();

async function getValueGauges() {
    const res = await fetch('https://bartio-pol-indexer.berachain-devnet.com/berachain/v1alpha1/beacon/vaults');
	const data = await res.json();
	console.log(data)

	if (res.ok) {
		return data.vaults.sort((a, b) => b.activeIncentivesInHoney - a.activeIncentivesInHoney);;
	} else {
		throw new Error(data);
	}
}

function selectVault(vault) {
  selectedVault = vault;
}

function closeVaultDetails() {
  selectedVault = null;
}
</script>

<style>

</style>


{#await promise}
	<p>...waiting</p>
{:then vaults}
	<div class="vault-grid">
	{#each vaults as vault}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="vault-card" on:click={() => selectVault(vault)}>
		{#if vault.metadata.logoURI}
			<img src={vault.metadata.logoURI} alt={vault.metadata.name} />
		{:else}
			<img src="https://png.pngtree.com/png-vector/20191018/ourmid/pngtree-question-mark-from-caramel-icon-png-image_1822193.jpg" alt={vault.metadata.name} />
		{/if}
		<h3>{vault.metadata.name}</h3>
		<p><strong>Active Incentives in Honey:</strong> {Intl.NumberFormat('ja-JP').format((Math.round(vault.activeIncentivesInHoney * 100) / 100).toFixed(2))}</p>
		<p><strong>Incentive token: </strong>
		{#if vault.vaultWhitelist.whitelistedTokens.length != 0 }
			{#each vault.vaultWhitelist.whitelistedTokens as whitelistedToken}
				{whitelistedToken.token.symbol}
			{/each}
		{:else}
			None
		{/if}
		</p>
		</div>
	{/each}
	</div>
	{#if selectedVault}


	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="vault-details" on:click={closeVaultDetails}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="vault-details-content" on:click|stopPropagation>
      <button class="close-button" on:click={closeVaultDetails}>&times;</button>
    	<h2><strong>Vault ID:</strong> {selectedVault.id}</h2>
		<p><strong>Staking token Address:</strong> {selectedVault.stakingTokenAddress}</p>
		
		<div class="vault-border">
		<h3>Metadata</h3>
  		<p><strong>Vault Name:</strong> {selectedVault.metadata.name}</p>
  		<p><strong>Logo:</strong> <img src={selectedVault.metadata.logoURI} alt={selectedVault.metadata.name} /></p>
  		<p><strong>Product:</strong> {selectedVault.metadata.product}</p>
  		<p><strong>Product URL:</strong> <a href={selectedVault.metadata.url} target="_blank">{selectedVault.metadata.url}</a></p>
  		<p><strong>Description:</strong> {selectedVault.metadata.productMetadata.description}</p>
		</div>

		<div class="vault-border">
  		<h3>Active Incentives</h3>
  		<p><strong>Active Incentives in Honey:</strong> {selectedVault.activeIncentivesInHoney}</p>
		</div>

		<div class="vault-border">
  		<h3>Other Details</h3>
  		<p><strong>Active Validators Count:</strong> {selectedVault.activeValidatorsCount}</p>
  		<p><strong>BGT Inflation Capture:</strong> {selectedVault.bgtInflationCapture}</p>
  		<p><strong>Total BGT Received:</strong> {selectedVault.totalBgtReceived}</p>
		</div>

		<Validators validators={selectedVault.activeValidators} />
      <!-- Add more details as needed -->
    </div>
  </div>




  
	
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}


