<script lang="ts">
    import { DrawOption } from "../types/DrawOption";
    import type { MatchResult } from "../types/MatchResult";
    import type { WinningType } from "../types/WinningType";
    import getDefaultTeamName from "../utils/getDefaultTeamName";

    export let winnerIdx: number;
    export let winningTeamCount: number;
    export let teamNames: string[];
    export let previousResults: MatchResult[];
    export let drawOption: DrawOption;

    let allCasesCount = 0;
    function searchAllResults(previous: MatchResult[], drawOption: DrawOption): MatchResult[][] {
        // case 1: 모든 경우의 수가 다 채워졌을 때
        if(!previous.find(e=>e.points == null)) {
            return [ previous ];
        }

        const _newPrevious1: MatchResult[] = JSON.parse(JSON.stringify(previous));
        const _newPrevious2: MatchResult[] = JSON.parse(JSON.stringify(previous));
        const _newPrevious3: MatchResult[] = JSON.parse(JSON.stringify(previous));

        const lastIdx = previous.findIndex(e=>e.points == null);
        
        if(drawOption == DrawOption.HAVE_DRAW) {
            _newPrevious1[lastIdx].points = 3; // WIN
            _newPrevious2[lastIdx].points = -3; // LOSE
            _newPrevious3[lastIdx].points = 0; // DRAW

            return [ 
                ...searchAllResults(_newPrevious1, drawOption), 
                ...searchAllResults(_newPrevious2, drawOption), 
                ...searchAllResults(_newPrevious3, drawOption) 
            ]
        } else {
            _newPrevious1[lastIdx].points = 3; // WIN
            _newPrevious2[lastIdx].points = -3; // LOSE

            return [ 
                ...searchAllResults(_newPrevious1, drawOption), 
                ...searchAllResults(_newPrevious2, drawOption),
            ]
        }
    }

    function getDefaultSet(teamNames: string[], previousResults: MatchResult[]): MatchResult[] {
        const defaultSet: MatchResult[] = [];
        for(let j = 0 ; j < teamNames.length; j++) {
            for(let i = 0 ; i < j; i++) {
                const previousResult = previousResults.find(e=> (e.match.includes(i) && e.match.includes(j)))
                defaultSet.push( previousResult || {
                    match: [ i, j ],
                    points: null
                });
            }
        }

        return defaultSet;
    }

    let winningTeamResults: MatchResult[][] = [];
    let winningTeamRankings: WinningType[] = [];

    let matchNames: string[] = [];
    $: {
        allCasesCount = teamNames.length * (teamNames.length-1) / 2
        const defaultSet = getDefaultSet(teamNames, previousResults);
        const allResults = searchAllResults(defaultSet, drawOption);

        const alreadyMatchFinished = previousResults.map(e=>e.match.toString());
        winningTeamResults = allResults.filter( ( e: MatchResult[] ) =>{
            const teamPoints: number[] = Array(teamNames.length).fill(0);
            for(let matchResult of e) {
                teamPoints[matchResult.match[0]] += matchResult.points!;
                teamPoints[matchResult.match[1]] -= matchResult.points!;
            }

            const minPointOfWinning = Object.assign([], teamPoints).sort().reverse()[winningTeamCount - 1];

            return teamPoints[winnerIdx] >= minPointOfWinning;
        }).map(e=>{
            // 이미 경기한 걸 ui에서 빼줌
            return e.filter(e=>!alreadyMatchFinished.includes(e.match.toString()));
        });

        winningTeamRankings = winningTeamResults.map(e=> {
            const teamPoints: number[] = Array(teamNames.length).fill(0);
            for(let matchResult of e) {
                teamPoints[matchResult.match[0]] += matchResult.points!;
                teamPoints[matchResult.match[1]] -= matchResult.points!;
            }
            // const minPointOfWinning = Object.assign([], teamPoints).sort().reverse()[winningTeamCount - 1];
            const sortedScores = Object.assign([], teamPoints).sort().reverse();
            const allRanks = teamPoints.map(point=>{
                return sortedScores.findIndex(score=>score==point) + 1
            });
            const myRanking = sortedScores.findIndex(e=>e == teamPoints[winnerIdx]) + 1
             
            return {
                tie: allRanks.filter(e=>e==myRanking).length >= 2,
                ranking: myRanking
            }
        });

        matchNames = allResults[0].filter(e=>{
            // 이미 경기한 걸 ui에서 빼줌
            return !alreadyMatchFinished.includes(e.match.toString())
        }).map(e=>{
            const team1Name = teamNames[e.match[0]] || getDefaultTeamName(e.match[0]);
            const team2Name = teamNames[e.match[1]] || getDefaultTeamName(e.match[1]);
            
            return `${team1Name} - ${team2Name}`;
        })
    }
</script>

<div>
    <table class="winning-table">
        <thead>
            <tr>
                {#each matchNames as name }
                    <th>{name}</th>
                {/each}
                <th>등수</th>
            </tr>
        </thead>
        <tbody>
            {#each winningTeamResults as matchResults, idx }
                <tr>
                    {#each matchResults as match} 
                        <td>
                            {#if match.points == 3}
                            {teamNames[match.match[0]] || getDefaultTeamName(match.match[0])} 승
                            {:else if match.points == 0}
                            무승부
                            {:else if match.points == -3}
                            {teamNames[match.match[1]] || getDefaultTeamName(match.match[1])} 승
                            {/if}
                        </td>
                    {/each}
                    <td>
                        {winningTeamRankings?.[idx].ranking || 0} 등
                        {winningTeamRankings?.[idx].tie ? "(동률)" : ""}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    .winning-table {
        thead {
            th {
                width: 180px;
                border: 1px solid black;
            }
        }
        tbody {
            td {
                border: 1px solid black;
            }
        }
    }
</style>