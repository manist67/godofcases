<script lang="ts">
    import { DrawOption } from "../types/DrawOption";
    import type { MatchResult } from "../types/MatchResult";
    import { ResultType } from "../types/ResultType";
    import getDefaultTeamName from "../utils/getDefaultTeamName";
    export let teamNames: string[];
    export let drawOption: DrawOption;
    export let previousResults: MatchResult[];
    
    let results: ResultType[][] = Array.from(Array(teamNames.length), () => Array(teamNames.length).fill(ResultType.NO_RESULT) );

    $: {
        if(drawOption == DrawOption.NO_DRAW) {
            for(let i = 0 ; i < results.length; i++) {
                for(let j = 0 ; j < results[i].length; j++) {
                    if(results[i][j] == ResultType.DRAW) results[i][j] = ResultType.NO_RESULT;
                }
            }
        }
        if(teamNames.length != results.length) {
            const _results: ResultType[][] = Array.from(Array(teamNames.length), () => Array(teamNames.length).fill(ResultType.NO_RESULT) );
            for(let i = 0; i < teamNames.length; i++) {
                for(let j = 0 ; j < teamNames.length; j++) {
                    _results[i][j] = results?.[i]?.[j] || ResultType.NO_RESULT;
                }
            }

            results = _results;
            adjustMatchResult();
        }
    }

    function setResult(idx1: number, idx2: number) {
        return (e: Event) => {
            const target = e.currentTarget as HTMLSelectElement;
            results[idx1][idx2] = target.value as unknown as ResultType;
            switch(results[idx1][idx2]) {
                case ResultType.NO_RESULT: break;
                case ResultType.WIN: results[idx2][idx1] = ResultType.LOSE; break;
                case ResultType.LOSE: results[idx2][idx1] = ResultType.WIN; break;
                case ResultType.DRAW: results[idx2][idx1] = ResultType.DRAW; break;
            }

            adjustMatchResult()
        }
    }

    function adjustMatchResult() {
        const _matchResults: MatchResult[] = [];
        for(let j = 0; j < results.length; j++) {
            for(let i = 0 ; i < j; i++) {
                if(results[i][j] == ResultType.NO_RESULT) continue;
                switch(results[i][j]) {
                    case ResultType.NO_RESULT: continue;
                    case ResultType.WIN: _matchResults.push({ match: [ i, j ], points: 3 }); break;
                    case ResultType.LOSE: _matchResults.push({ match: [ i, j ], points: 0 }); break;
                    case ResultType.DRAW: _matchResults.push({ match: [ i, j ], points: 1 }); break;
                }
            }
        }

        console.log(_matchResults);
        previousResults = _matchResults;
    }

    function resultTypeToStr(resultType: ResultType) {
        switch(resultType){
            case ResultType.NO_RESULT: return "-";
            case ResultType.WIN: return "승";
            case ResultType.LOSE: return "패";
            case ResultType.DRAW: return "무";
        }
    }
</script>

<div class="table-of-games-wrapper">
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
                                    <option value={ResultType.NO_RESULT}>-</option>
                                    <option value={ResultType.WIN}>{team1 || getDefaultTeamName(idx1)} 승</option>
                                    { #if drawOption == DrawOption.HAVE_DRAW }<option value={ResultType.DRAW}>무승부</option> {/if}
                                    <option value={ResultType.LOSE}>{team2 || getDefaultTeamName(idx2)} 승</option>
                                </select>
                            {/if}
                            {#if (idx1 != idx2 && idx2 < idx1)}
                                {#if results?.[idx2]?.[idx1] == ResultType.WIN}
                                <span> {team2 || getDefaultTeamName(idx2)} 승 </span>
                                {:else if results?.[idx2]?.[idx1] == ResultType.LOSE}
                                <span> {team1 || getDefaultTeamName(idx1)} 승 </span>
                                {:else if results?.[idx2]?.[idx1] == ResultType.DRAW}
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
    <div class="result-wrapper">
        <h3>경기 결과</h3>
        <div class="div-results">
            {#each teamNames as team1, idx1 }
                    {#each teamNames as team2, idx2 }
                        {#if (idx1 != idx2 && idx1 < idx2) }
                            <div class="div-match-result">
                                <div class="team-wrapper">
                                    {team1 || getDefaultTeamName(idx1)}
                                    {resultTypeToStr(results?.[idx1]?.[idx2])}
                                </div>
                                <span class="span-versus">vs</span>
                                <div class="team-wrapper">
                                    {team2 || getDefaultTeamName(idx2)}
                                    {resultTypeToStr(results?.[idx2]?.[idx1])}
                                </div>
                            </div>
                        {/if}
                    {/each}
            {/each}
        </div>
    </div>
</div>


<style lang="scss">
    .table-of-games-wrapper {
        display: flex;
    }
    th {
        width: 64px;
    }
    .result-wrapper {
        margin-left: 80px;
        h3 {
            margin: 0;
        }
        .div-match-result {
            display: flex;
            width: 240px;
            .team-wrapper {
                flex: 1;
            }
        }
    }
</style>