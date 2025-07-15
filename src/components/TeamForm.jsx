import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
`;

const Input = styled.input`
    padding: 0.5rem;
    font-size: 1rem;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: #222;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #444;
    }
`;

export default function TeamForm({ onAddTeam }) {
    const [teamName, setTeamName] = useState('');
    const [playerNames, setPlayerNames] = useState(['']);

    const handlePlayerChange = (index, value) => {
        const newPlayers = [...playerNames];
        newPlayers[index] = value;
        setPlayerNames(newPlayers);
    };

    const addPlayerField = () => {
        setPlayerNames([...playerNames, '']);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const team = {
            name: teamName,
            players: playerNames.filter(name => name.trim() !== ''),
            logo: '⚽' // placeholder, pode ser um emoji ou ícone
        };

        onAddTeam(team);
        setTeamName('');
        setPlayerNames(['']);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3>Create a Team</h3>
            <label>Team Name:</label>
            <Input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
            />

            <label>Players:</label>
            {playerNames.map((player, index) => (
                <Input
                    key={index}
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={player}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                />
            ))}
            <Button type="button" onClick={addPlayerField}>
                + Add Player
            </Button>

            <Button type="submit">Save Team</Button>
        </Form>
    );
}