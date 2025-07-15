import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';

const Table = styled.table`
    width: 100%;
    margin-top: 2rem;
    border-collapse: collapse;

    th, td {
        padding: 0.5rem;
        border: 1px solid #ddd;
        text-align: center;
    }
`;

const mockTeams = ['Vasco', 'Flamengo', 'Botafogo', 'Palmeiras'];

function generateMatches(teams) {
    const matches = [];
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push({ home: teams[i], away: teams[j] });
        }
    }
    return matches;
}

function simulateMatch(home, away) {
    const homeGoals = Math.floor(Math.random() * 5);
    const awayGoals = Math.floor(Math.random() * 5);
    return { home, away, homeGoals, awayGoals };
}

function calculateStandings(matches) {
    const standings = {};

    matches.forEach(({ home, away, homeGoals, awayGoals }) => {
        [home, away].forEach(team => {
            if (!standings[team]) {
                standings[team] = {
                    team,
                    points: 0,
                    played: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    goalDifference: 0
                };
            }
        });

        const homeStats = standings[home];
        const awayStats = standings[away];

        homeStats.played++;
        awayStats.played++;
        homeStats.goalsFor += homeGoals;
        homeStats.goalsAgainst += awayGoals;
        awayStats.goalsFor += awayGoals;
        awayStats.goalsAgainst += homeGoals;

        if (homeGoals > awayGoals) {
            homeStats.wins++;
            homeStats.points += 3;
            awayStats.losses++;
        } else if (homeGoals < awayGoals) {
            awayStats.wins++;
            awayStats.points += 3;
            homeStats.losses++;
        } else {
            homeStats.draws++;
            awayStats.draws++;
            homeStats.points += 1;
            awayStats.points += 1;
        }

        homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;
        awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;
    });

    return Object.values(standings).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
}

export default function SimulationPage() {
    const [matches, setMatches] = useState([]);
    const [standings, setStandings] = useState([]);

    useEffect(() => {
        const rawMatches = generateMatches(mockTeams).map(m =>
            simulateMatch(m.home, m.away)
        );
        setMatches(rawMatches);
        setStandings(calculateStandings(rawMatches));
    }, []);

    const regenerateSimulation = () => {
        const newMatches = generateMatches(mockTeams).map(m =>
            simulateMatch(m.home, m.away)
        );
        setMatches(newMatches);
        setStandings(calculateStandings(newMatches));
    };

    return (
        <Layout>
            <h2>Simulation - League Format</h2>

            <button onClick={regenerateSimulation} style={{ margin: '1rem 0' }}>
                🔁 Re-simulate Matches
            </button>

            <Table>
                <thead>
                <tr>
                    <th>Team</th>
                    <th>Pts</th>
                    <th>Wins</th>
                    <th>Draws</th>
                    <th>Losses</th>
                    <th>GoalsF</th>
                    <th>GoalsA</th>
                    <th>GoalDiff</th>
                </tr>
                </thead>
                <tbody>
                {standings.map((team, idx) => (
                    <tr key={idx}>
                        <td>{team.team}</td>
                        <td>{team.points}</td>
                        <td>{team.wins}</td>
                        <td>{team.draws}</td>
                        <td>{team.losses}</td>
                        <td>{team.goalsFor}</td>
                        <td>{team.goalsAgainst}</td>
                        <td>{team.goalDifference}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <h3>Match Results:</h3>
            <ul>
                {matches.map((match, idx) => (
                    <li key={idx}>
                        {match.home} {match.homeGoals} x {match.awayGoals} {match.away}
                    </li>
                ))}
            </ul>
        </Layout>
    );
}