<script lang="ts">
  // import svelteLogo from './assets/svelte.svg'
  // import viteLogo from '/vite.svg'
  import TableOfGames from "./lib/TableOfGames.svelte";
  import TeamAliases from "./lib/TeamAliases.svelte";
  // import SelectSupportTeam from "./lib/SelectSupportTeam.svelte";
  import SelectWinnerTab from "./lib/SelectWinnerTab.svelte";
  import WinningTable from "./lib/WinningTable.svelte";

  import { DrawOption } from "./types/DrawOption";
  import type { MatchResult } from "./types/MatchResult";

  let teamCount: number = 3;
  let teamNames: string[] = Array<string>(teamCount);
  let supportTeamIdx = 0;
  let drawOption: DrawOption = DrawOption.HAVE_DRAW;
  let winnerIdx = 0;
  let previousResults: MatchResult[] = [];


  $: {
    teamNames.length = teamCount;
    if(teamCount <= supportTeamIdx) {
      supportTeamIdx = teamCount - 1;
    }
  }

  function onChangeDrawOption(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    drawOption = target.value as DrawOption;
  }
</script>

<main>
  <h1>킹우의 수 계산기</h1>
  <div>
    <h2>팀 숫자 설정</h2>
    <input type="number" bind:value={teamCount}>
    <ul>
      <li> 
        <input type="radio" 
          name="draw_option" 
          id="HAVE_DRAW"
          value={DrawOption.HAVE_DRAW}
          checked={drawOption==DrawOption.HAVE_DRAW}
          on:change={onChangeDrawOption}> 
        <label for="HAVE_DRAW">무승부 있음</label> 
      </li>
      <li> 
        <input type="radio" 
          name="draw_option" 
          id="NO_DRAW"
          value={DrawOption.NO_DRAW}
          checked={drawOption==DrawOption.NO_DRAW}
          on:change={onChangeDrawOption}> 
        <label for="NO_DRAW">무승부 없음</label>
      </li>
    </ul>
  </div>

  <div>
    <h2>팀 별칭 설정</h2>
    <h3>* 공백 시 A,B,C,D ... 으로 설정됩니다</h3>
    <TeamAliases bind:teamCount={teamCount} bind:teamNames={teamNames}/>
  </div>

  <!-- <div>
    <h2>응원팀 설정</h2>
    <SelectSupportTeam bind:teamNames={teamNames} bind:supportTeamIdx={supportTeamIdx}/>
  </div> -->

  <div>
    <h2>현재까지 경기 결과</h2>
    <h3>* 공백 시 모든 경우의 수 노출 됩니다</h3>
    <TableOfGames teamNames={teamNames} drawOption={drawOption} previousResults={previousResults}/>
  </div>

  <div>
    <h2>결과</h2>
    <SelectWinnerTab bind:winnerIdx = {winnerIdx} bind:teamNames={teamNames}/>
    <WinningTable winnerIdx = {winnerIdx} teamNames={teamNames} previousResults={previousResults}/>
  </div>
</main>

<style lang="scss">
  h2 {
    margin-bottom: 4px;
  }
  h3 {
    color: red;
    font-size: 0.8rem;
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
  }
</style>
