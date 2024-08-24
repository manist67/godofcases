<script lang="ts">
    import getDefaultTeamName from "../utils/getDefaultTeamName";

    export let winnerIdx: number = 0;
    export let teamNames: string[];

    function setWinnerIdx(idx: number) {
        return () => {
            winnerIdx = idx;
        }
    }
</script>

<div>
    {#each teamNames as team, idx }
        <button on:click={setWinnerIdx(idx)} class:selected={winnerIdx == idx}> { team || getDefaultTeamName(idx) }</button>
    {/each}
</div>

<style lang="scss">
    button.selected {
        color: red;
    }
</style>