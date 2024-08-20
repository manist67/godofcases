<script lang="ts">
  import getDefaultTeamName from "../utils/getDefaultTeamName";
  export let teamNames: string[] = [];
  export let supportTeamIdx: number;
</script>

<select bind:value={supportTeamIdx}>
  {#each teamNames as name, idx}
    <option value={idx}>
      {(idx + 10).toString(36).toUpperCase()} : 
      {name || getDefaultTeamName(idx) }
    </option>
  {/each}
</select>

<style>
  
</style>
 