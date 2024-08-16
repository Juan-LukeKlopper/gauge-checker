<script>
  export let validators;
  let showModal = false;

  // Number of validators to display initially
  const initialDisplayCount = 6;
  let paginatedValidators = validators.slice(0, initialDisplayCount);

  function showAllValidators() {
    showModal = true;
  }

  function closeAllValidators() {
    showModal = false;
  }
</script>

<div class="validators">
  <h3>Validators emmiting BGT to this vault.</h3>
  <ul>
    {#each paginatedValidators as validator}
        {#if validator.logoURI}
          <img class="img" src={validator.logoURI} alt={validator.name} width="50"/>
        {/if}
    {/each}
  </ul>

  {#if validators.length > initialDisplayCount}
    <button class="toggle-button" on:click={showAllValidators}>Expand to view all</button>
  {:else if validators.length == 0}
    <p>There are no validators currently emmiting to this pool.</p>
  {/if}
</div>

{#if showModal}
  <div class="modal">
    <div class="modal-content">
      <span class="close" on:click={() => showModal = false}>&times;</span>
      <h2>All Validators</h2>
      <button class="toggle-button" on:click={closeAllValidators}>&times;</button>
      <ul>
        {#each validators as validator}
          <li>
            <strong>Name:</strong> {validator.name} <br/>
            <strong>Description:</strong> {validator.Description} <br/>
            <strong>Website:</strong> <a href={validator.website} target="_blank">{validator.website}</a> <br/>
            <strong>Twitter:</strong> <a href={validator.twitter} target="_blank">{validator.twitter}</a> <br/>
            {#if validator.logoURI}
              <img class="img" src={validator.logoURI} alt={validator.name} width="50"/>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

<style>
  .validators {
    margin: 20px;
  }

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: var(--color-bg-2);
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-height: 80%;
    overflow-y: auto;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
    font-size: 1.5em;
  }

  button {
    margin-top: 10px;
  }
</style>
