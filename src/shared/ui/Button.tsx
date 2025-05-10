import styled from "styled-components";
import type { ReactNode } from "react";

interface StyledButtonProps {
  children: ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
  color?: string;
  padding?: string;
  fontSize?: string;
}

const ButtonBase = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ backgroundColor }) => backgroundColor ? "#2c2c2c":""};
  color: ${({ color }) => color ?? "white"};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: ${({ fontSize }) => fontSize ?? "14px"};
  padding: ${({ padding }) => padding ?? "8px 12px"};

  svg {
    font-size: 16px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const StyledButton = ({
  children,
  onClick,
  ...rest
}: StyledButtonProps) => {
  return (
    <ButtonBase onClick={onClick} {...rest}>
      {children}
    </ButtonBase>
  );
};