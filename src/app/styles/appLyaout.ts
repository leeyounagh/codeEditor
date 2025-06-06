// app/styles/appLayout.ts
import styled from "styled-components";

export const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  overflow-x: auto;
`;

export const Header = styled.header`
  padding-left: 1rem;
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
  padding-left: 0px;
  border-bottom: 1px solid #333;
  height: 64px;
  overflow-x: auto;
  white-space: nowrap;
`;

export const Main = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;
export const Sidebar = styled.aside<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? "250px" : "40px")};
  min-width: ${({ $open }) => ($open ? "250px" : "40px")};
  max-width: ${({ $open }) => ($open ? "250px" : "40px")};
  flex-shrink: 0;
  background-color: #1c1c1c;
  overflow-y: auto;
  color: #e0e0e0;
  border-right: 1px solid #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: ${({ $open }) => ($open ? "200px" : "40px")};
    min-width: ${({ $open }) => ($open ? "200px" : "40px")};
    max-width: ${({ $open }) => ($open ? "200px" : "40px")};
  }
`;
export const SidebarContent = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? "block" : "none")};

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
  }
`;
export const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background-color: #333;
  border: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.2s;

  &:hover {
    background-color: #555;
  }

  svg {
    color: white;
    width: 20px;
    height: 20px;
  }
`;

export const EditorArea = styled.section`
  flex: 1;
  background-color: #1e1e1e;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const PreviewImage = styled.img`
  max-width: 70%;
  max-height: 60vh;
  object-fit: contain;
  padding: 1rem;
  margin: 2rem auto;
  display: block;
  border-radius: 8px;
`;
