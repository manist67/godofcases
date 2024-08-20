<script lang="ts">
  export let teamCount: number;
  export let teamNames: string[];
</script>

<ul>
  {#each Array(teamCount) as _, idx}
    <li>
      <span>{(idx + 10).toString(36).toUpperCase()} : </span>
      <input bind:value={teamNames[idx]}>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  ul > li {
    margin-bottom: 16px;
  }
</style>
 