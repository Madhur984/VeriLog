export type GateMode = 'nand' | 'nor';

export interface SceneProps {
  isActive: boolean;
  isDarkMode: boolean;
  mode: GateMode;
}
