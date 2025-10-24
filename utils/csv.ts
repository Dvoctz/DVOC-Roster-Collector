
import { Submission, PlayerData } from '../types';

const CSV_HEADER = 'team_name,player_name,division,position,submitted_at\n';

const escapeCsvField = (field: string): string => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
};

const createCsvRow = (teamName: string, player: PlayerData, submittedAt: string): string => {
    const row = [
        teamName,
        player.playerName,
        player.division,
        player.position,
        submittedAt
    ];
    return row.map(escapeCsvField).join(',') + '\n';
};

export const generateCsvContent = (submissions: Submission[]): string => {
    let csvContent = CSV_HEADER;
    submissions.forEach(submission => {
        submission.players.forEach(player => {
            csvContent += createCsvRow(submission.teamName, player, submission.submittedAt);
        });
    });
    return csvContent;
};

export const downloadCsv = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
