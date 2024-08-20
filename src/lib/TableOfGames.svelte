<script lang="ts">
    import getDefaultTeamName from "../utils/getDefaultTeamName";
    export let teamNames: string[];

    let results: string[][] = Array.from(Array(teamNames.length), ()=>Array(teamNames.length));

    function setResult(idx1: number, idx2: number) {
        return (e: Event) => {
            const target = e.target as HTMLSelectElement;
            results[idx1][idx2] = target.value;
        }
    }
</script>

<table>
    <thead>
        <th></th>
        {#each teamNames as team1, idx1 }
            <th>{team1 || getDefaultTeamName(idx1) }</th>
        {/each}
    </thead>
    <tbody>
        {#each teamNames as team1, idx1 }
            <tr>
                <th>{team1 || getDefaultTeamName(idx1)}</th>
                {#each teamNames as team2, idx2 }
                    <td>
                        {#if (idx1 != idx2 && idx1 < idx2) }
                            <select on:change={setResult(idx1, idx2)}>
                                <option value="">-</option>
                                <option value="W">{team1 || getDefaultTeamName(idx1)} 승</option>
                                <option value="D">무승부</option>
                                <option value="L">{team2 || getDefaultTeamName(idx2)} 승</option>
                            </select>
                        {/if}
                        {#if (idx1 != idx2 && idx2 < idx1)}
                            {#if results[idx2][idx1] == "W"}
                            <span> {team2 || getDefaultTeamName(idx2)} 승 </span>
                            {:else if results[idx2][idx1] == "L"}
                            <span> {team1 || getDefaultTeamName(idx1)} 승 </span>
                            {:else if results[idx2][idx1] == "D"}
                            <span> 무승부 </span>
                            {:else}
                            <span>-</span>
                            {/if}
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>


<style>
    th {
        width: 64px;
    }
</style>