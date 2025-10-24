import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Player, Division, Position } from '../types';
import { DIVISIONS, POSITIONS, MAX_PLAYERS } from '../constants';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';

const CaptainForm = () => {
    const [teamName, setTeamName] = useState('');
    const [players, setPlayers] = useState<Player[]>([
        { id: crypto.randomUUID(), playerName: '', division: Division.D1, position: Position.MAIN_NETTY }
    ]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addPlayer = () => {
        if (players.length >= MAX_PLAYERS) {
            setError(`You can add up to ${MAX_PLAYERS} players.`);
            return;
        }
        setPlayers([...players, { id: crypto.randomUUID(), playerName: '', division: Division.D1, position: Position.MAIN_NETTY }]);
        setError(null);
    };

    const removePlayer = (id: string) => {
        if (players.length > 1) {
            setPlayers(players.filter(p => p.id !== id));
        }
    };

    const handlePlayerChange = (id: string, field: keyof Omit<Player, 'id'>, value: string) => {
        setPlayers(players.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const resetForm = () => {
        setTeamName('');
        setPlayers([{ id: crypto.randomUUID(), playerName: '', division: Division.D1, position: Position.MAIN_NETTY }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!teamName.trim() || players.some(p => !p.playerName.trim())) {
            setError('Please complete all required fields.');
            return;
        }
        
        if (players.length === 0) {
            setError('Please add at least one player.');
            return;
        }

        setIsSubmitting(true);

        const { error: insertError } = await supabase.from('submissions').insert({
            team_name: teamName.trim(),
            players: players.map(({ id, ...playerData }) => playerData) // Exclude client-side id
        });

        setIsSubmitting(false);

        if (insertError) {
            console.error('Error inserting data:', insertError);
            setError(`Submission failed: ${insertError.message}`);
        } else {
            setSuccess('Thanks! Your roster was submitted.');
            resetForm();
            setTimeout(() => setSuccess(null), 5000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Submit Team Roster</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Fill out your team's information below.</p>

                {error && <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-4 rounded" role="alert">{error}</div>}
                {success && <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 mb-4 rounded" role="alert">{success}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-8">
                        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Team Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="block w-full px-4 py-2 bg-white dark:bg-white border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-900"
                            required
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Players ({players.length}/{MAX_PLAYERS})</h2>
                    <div className="space-y-4 mb-6">
                        {players.map((player, index) => (
                            <div key={player.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                                <div className="md:col-span-4">
                                    <label htmlFor={`playerName-${player.id}`} className="block text-xs font-medium text-gray-600 dark:text-gray-300">Player Name <span className="text-red-500">*</span></label>
                                    <input type="text" id={`playerName-${player.id}`} value={player.playerName} onChange={(e) => handlePlayerChange(player.id, 'playerName', e.target.value)} className="mt-1 block w-full input-field" required />
                                </div>
                                <div className="md:col-span-3">
                                    <label htmlFor={`division-${player.id}`} className="block text-xs font-medium text-gray-600 dark:text-gray-300">Division <span className="text-red-500">*</span></label>
                                    <select id={`division-${player.id}`} value={player.division} onChange={(e) => handlePlayerChange(player.id, 'division', e.target.value)} className="mt-1 block w-full select-field">
                                        {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-4">
                                    <label htmlFor={`position-${player.id}`} className="block text-xs font-medium text-gray-600 dark:text-gray-300">Position <span className="text-red-500">*</span></label>
                                    <select id={`position-${player.id}`} value={player.position} onChange={(e) => handlePlayerChange(player.id, 'position', e.target.value)} className="mt-1 block w-full select-field">
                                        {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-1 flex items-end justify-end">
                                     <button type="button" onClick={() => removePlayer(player.id)} disabled={players.length <= 1} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-800 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                        <TrashIcon className="h-5 w-5" />
                                     </button>
                                </div>
                            </div>
                        ))}
                    </div>

                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button type="button" onClick={addPlayer} disabled={players.length >= MAX_PLAYERS} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            <PlusIcon className="h-5 w-5" />
                            Add Player
                        </button>
                        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait">
                            {isSubmitting ? 'Submitting...' : 'Submit Roster'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CaptainForm;