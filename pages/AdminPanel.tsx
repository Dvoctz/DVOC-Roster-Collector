
import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Submission } from '../types';
import { generateCsvContent, downloadCsv } from '../utils/csv';
import DownloadIcon from '../components/icons/DownloadIcon';

const AdminPanel = () => {
    const [submissions] = useLocalStorage<Submission[]>('submissions', []);

    const handleDownloadAll = () => {
        if (submissions.length === 0) return;
        const csvContent = generateCsvContent(submissions);
        downloadCsv(csvContent, 'all_teams_rosters.csv');
    };

    const handleDownloadTeam = (submission: Submission) => {
        const csvContent = generateCsvContent([submission]);
        const filename = `${submission.teamName.replace(/\s+/g, '_')}_${submission.submittedAt.split('T')[0]}.csv`;
        downloadCsv(csvContent, filename);
    };

    const groupedSubmissions = submissions.reduce((acc, submission) => {
        (acc[submission.teamName] = acc[submission.teamName] || []).push(submission);
        return acc;
    }, {} as Record<string, Submission[]>);


    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel: Roster Submissions</h1>
                <button
                    onClick={handleDownloadAll}
                    disabled={submissions.length === 0}
                    className="inline-flex items-center gap-2 justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <DownloadIcon className="h-5 w-5" />
                    Download All Teams CSV
                </button>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No submissions yet.</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">When a captain submits a roster, it will appear here.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedSubmissions).map(([teamName, teamSubmissions]) => (
                         <div key={teamName}>
                             <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{teamName}</h2>
                             <div className="space-y-6">
                                {teamSubmissions.map((submission) => (
                                    <div key={submission.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                                        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Submission ID: {submission.id.substring(0,8)}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Submitted at: {new Date(submission.submittedAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadTeam(submission)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <DownloadIcon className="h-4 w-4" />
                                                Download Team CSV
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Player Name</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Division</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {submission.players.map((player, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{player.playerName}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{player.division}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{player.position}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
