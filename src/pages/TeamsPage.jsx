import {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import TeamForm from '../components/TeamForm';
import {loadFromStorage, saveToStorage} from "../utils/storage.js";

export default function TeamsPage() {
    const [teams, setTeams] = useState(() => loadFromStorage('teams', []));

    useEffect(() => {
        saveToStorage('teams', teams);
    })

    const handleAddTeam = (newTeam) => {
        setTeams([...teams, newTeam]);
    };

    return (
        <Layout>
            <h2>Manage Teams</h2>
            <TeamForm onAddTeam={handleAddTeam} />

            <h3>Registered Teams:</h3>
            <ul>
                {teams.map((team, index) => (
                    <li key={index}>
                        {team.logo} <strong>{team.name}</strong> - {team.players.length} players
                    </li>
                ))}
            </ul>
        </Layout>
    );
}