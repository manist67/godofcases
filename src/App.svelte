<script lang="ts">
  // import svelteLogo from './assets/svelte.svg'
  // import viteLogo from '/vite.svg'
  import TableOfGames from "./lib/TableOfGames.svelte";
  import TeamAliases from "./lib/TeamAliases.svelte";
  import SelectSupportTeam from "./lib/SelectSupportTeam.svelte";

  let teamCount: number = 3;
  let teamNames: string[] = Array<string>(teamCount);
  let supportTeamIdx = 0;

  $: {
    teamNames.length = teamCount;
    if(teamCount <= supportTeamIdx) {
      supportTeamIdx = teamCount - 1;
    }
  }
</script>

<main>
  <h1>킹우의 수 계산기</h1>
  <div>
    <h2>팀 숫자 설정</h2>
    <input type="number" bind:value={teamCount}>
  </div>

  <div>
    <h2>팀 별칭 설정</h2>
    <h3>* 공백 시 A,B,C,D ... 으로 설정됩니다</h3>
    <TeamAliases bind:teamCount={teamCount} bind:teamNames={teamNames}/>
  </div>

  <div>
    <h2>응원팀 설정</h2>
    <SelectSupportTeam bind:teamNames={teamNames} bind:supportTeamIdx={supportTeamIdx}/>
  </div>

  <div>
    <h2>현재까지 경기 결과</h2>
    <h3>* 공백 시 모든 경우의 수 노출 됩니다</h3>
    <TableOfGames teamNames={teamNames}/>
  </div>
</main>

<style>
  h2 {
    margin-bottom: 4px;
  }
  h3 {
    color: red;
    font-size: 0.8rem;
    margin: 0;
  }
</style>
