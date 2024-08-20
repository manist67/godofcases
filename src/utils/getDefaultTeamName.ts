export default function getDefaultTeamName(idx: number): string {
    return (idx + 10).toString(36).toUpperCase() + "팀"
}