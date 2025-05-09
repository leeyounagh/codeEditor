// app/styles/appLayout.ts
import styled from "styled-components";

export const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  overflow-x:auto;
`;

export const Header = styled.header`
  padding-left: 1.5rem;
  background-color: #1a1a1a;
  color: white;
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
  height: 64px;
  display: flex;
  align-items: center;
`;

export const TabArea = styled.div`
  background-color: #1a1a1a;
  color: white;
  padding: 0 1rem;
  border-bottom: 1px solid #333;
  height: 64px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Main = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const Sidebar = styled.aside`
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  flex-shrink: 0;
  background-color: #1c1c1c;
  overflow-y: auto;
  color: #e0e0e0;
  border-right: 1px solid #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EditorArea = styled.section`
  flex: 1;
  background-color: #1e1e1e;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
