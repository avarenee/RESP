import React from "react";
import { Link } from 'react-router-dom';
import resp from './../assets/RESPlogo.png';
import styled from 'styled-components';

export default function Home() {
  return(
    <Body>
      <div>
        <Img alt="Logo not available" src={resp} />
        <H1>RESP</H1>
        <H2>Responsive Emotional Support Protocols for First Responders</H2>
        <Div>
          <Link to='/check-in'><Button style={{backgroundColor: "#160f6f"}}>New Check-in</Button></Link>
        <p></p>
          <Link to='/search'><Button style={{backgroundColor: "tomato"}}>New Search</Button></Link>
        </Div>
      </div>
    </Body>
  );
}

const Body = styled.body`
  background-color: #b0caed;
  align-items: center;
  height:100vh;
  padding-top: 80px;
`;

const Button = styled.button`
  border: none;
  color: white;
  min-width: 200px;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 18px;
`;

const Div = styled.div`
  width: 200px;
  margin: auto;
  margin-top: 60px;
`;

const H1 = styled.h1`
  margin-top: 0px;
  margin-bottom: 0px;
  text-align: center;
  font-weight: 700px;
  font-size: 100px;
  color: #160f6f;
`;

const H2 = styled.h2`
  text-align: center;
  font-size: 27px;
  margin-top: 0px;
  font-weight: normal;
  color: #160f6f;
`;

const Img = styled.img`
  display: block;
  margin-bottom: 0px;
  margin-left: auto;
  margin-right: auto;
  width: 300px;
  height: 300px;
`;
