import { useState } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';

const mockTeams = [
    { name: 'Vasco', logo: '⚽' },
    { name: 'Flamengo', logo: '🔥' },
    { name: 'Botafogo', logo: '⭐' },
    { name: 'Palmeiras', logo: '🌿' }
];

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
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

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function CreateChampionshipPage() {
    const [name, setName] = useState('');
    const [format, setFormat] = useState('league');
    const [selectedTeams, setSelectedTeams] = useState([]);

    const toggleTeamSelection = (teamName) => {
        setSelectedTeams(prev =>
            prev.includes(teamName)
                ? prev.filter(name => name !== teamName)
                : [...prev, teamName]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newChampionship = {
            name,
            format,
            teams: selectedTeams
        };

        console.log('Created Championship:', newChampionship);
        alert(`Championship "${name}" created with ${selectedTeams.length} team(s).`);

        setName('');
        setFormat('league');
        setSelectedTeams([]);
    };

    return (
        <Layout>
            <h2>Create a New Championship</h2>
            <Form onSubmit={handleSubmit}>
                <label>Championship Name:</label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Format:</label>
                <Select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                >
                    <option value="league">League (Round-robin)</option>
                    <option value="knockout">Knockout (Elimination)</option>
                </Select>

                <label>Select Teams:</label>
                <CheckboxList>
                    {mockTeams.map(team => (
                        <label key={team.name}>
                            <input
                                type="checkbox"
                                value={team.name}
                                checked={selectedTeams.includes(team.name)}
                                onChange={() => toggleTeamSelection(team.name)}
                            />
                            {team.logo} {team.name}
                        </label>
                    ))}
                </CheckboxList>

                <Button type="submit">Create Championship</Button>
            </Form>
        </Layout>
    );
}