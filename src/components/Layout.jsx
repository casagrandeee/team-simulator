import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    font-family: sans-serif;
    padding: 0;
    margin: 0;
`;

const Header = styled.div`
    background-color: #222;
    padding:  1rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Nav = styled.nav`
    a {
        color: white;
        margin-right: 1rem;
        text-decoration: none;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;

export default function Layout ({ children }) {
    return (
        <Container>
            <Header>
                <h1>Team Simulator</h1>
                <Nav>
                    <Link to="/">Home</Link>
                    <Link to="/teams">Teams</Link>
                    <Link to="/championship">Championship</Link>
                    <Link to="/simulate">Simulate</Link>
                </Nav>
            </Header>
            <main>{children}</main>
        </Container>
    );
}