import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import {loadFromStorage, saveToStorage} from "../utils/storage.js";

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

const storedTeams = loadFromStorage('teams', []);
const teamNames = storedTeams.map(t => t.name);

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
    const result = {
        home,
        away,
        homeGoals: Math.floor(Math.random() * 5),
        awayGoals: Math.floor(Math.random() * 5),
        stats: {
            possession: {
                home: Math.floor(Math.random() * 21) + 40 // Garante entre 40% e 60%
            },
            shots: {
                home: Math.floor(Math.random() * 15),
                away: Math.floor(Math.random() * 15),
            },
            fouls: {
                home: Math.floor(Math.random() * 10),
                away: Math.floor(Math.random() * 10),
            },
            yellowCards: {
                home: Math.floor(Math.random() * 4),
                away: Math.floor(Math.random() * 4),
            },
            redCards: {
                home: Math.floor(Math.random() * 2),
                away: Math.floor(Math.random() * 2),
            }
        }
    };
    result.stats.possession.away = 100 - result.stats.possession.home;

    return result;
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
        const saved = loadFromStorage('matches');
        if (saved.length > 0) {
            setMatches(saved);
            setStandings(calculateStandings(saved));
        } else {
            const rawMatches = generateMatches(teamNames).map(m =>
                simulateMatch(m.home, m.away)
            );
            setMatches(rawMatches);
            setStandings(calculateStandings(rawMatches));
            saveToStorage('matches', rawMatches);
        }
    }, []);

    const regenerateSimulation = () => {
        const newMatches = generateMatches(teamNames).map(m =>
            simulateMatch(m.home, m.away)
        );
        setMatches(newMatches);
        setStandings(calculateStandings(newMatches));
        saveToStorage('matches', newMatches);
    };

    const handleGoalChange = (idx, type, value) => {
        const updated = [...matches];
        updated[idx][type] = parseInt(value, 10) || 0;
        setMatches(updated);
        setStandings(calculateStandings(updated));
        saveToStorage('matches', updated);
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
                <div style={{ marginTop: '2rem' }}>
                    {matches.map((match, idx) => (
                        <div key={idx} style={{ marginBottom: '1.5rem' }}>
                            <strong>
                                {match.home}
                                <input
                                    type="number"
                                    value={match.homeGoals}
                                    min="0"
                                    style={{ width: '3rem', margin: '0 0.5rem' }}
                                    onChange={(e) => handleGoalChange(idx, 'homeGoals', e.target.value)}
                                />
                                x
                                <input
                                    type="number"
                                    value={match.awayGoals}
                                    min="0"
                                    style={{ width: '3rem', margin: '0 0.5rem' }}
                                    onChange={(e) => handleGoalChange(idx, 'awayGoals', e.target.value)}
                                />
                                {match.away}
                            </strong>
                            <ul style={{ fontSize: '0.9rem', marginTop: '0.5rem', paddingLeft: '1rem' }}>
                                <li>Posse de bola: {match.stats.possession.home}% - {match.stats.possession.away}%</li>
                                <li>Finalizações: {match.stats.shots.home} - {match.stats.shots.away}</li>
                                <li>Faltas: {match.stats.fouls.home} - {match.stats.fouls.away}</li>
                                <li>Amarelos: {match.stats.yellowCards.home} - {match.stats.yellowCards.away}</li>
                                <li>Vermelhos: {match.stats.redCards.home} - {match.stats.redCards.away}</li>
                            </ul>
                        </div>
                    ))}
                </div>
        </Layout>
    );
}