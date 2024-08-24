<script lang="ts">
    import type { MatchResult } from "../types/MatchResult";

    export let winnerIdx: number;
    export let teamNames: string[];
    export let previousResults: MatchResult[];

    $: {
        console.log(winnerIdx);
        console.log(teamNames);
        console.log(previousResults);
    }
</script>

