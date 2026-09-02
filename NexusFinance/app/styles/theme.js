// Tema central do NexusFinance
// Reúne as cores já usadas no projeto em um único lugar, para manter
// consistência visual entre a tela inicial, a barra de navegação e,
// futuramente, as demais telas.

export const colors = {
  // Fundo
  background: "#0f0f0f",
  backgroundAlt: "#0f0f13",
  surface: "#1c1c1c",
  surfaceAlt: "#181820",
  surfaceElevated: "#222226",

  // Marca / destaque (indigo-violeta)
  primary: "#5145FF",
  primaryDark: "#1809e0",
  primaryDeep: "#4800FF",
  primarySoft: "rgba(81, 69, 255, 0.16)",

  // Estados
  success: "#2ED573",
  successSoft: "rgba(46, 213, 115, 0.16)",
  danger: "#FF6B6B",
  dangerStrong: "#FF4D4D",
  dangerSoft: "rgba(255, 107, 107, 0.16)",
  warning: "#FFC542",

  // Texto
  textPrimary: "#FFFFFF",
  textSecondary: "#A5A5A5",
  textMuted: "#9fa8c3",
  textLink: "#cfd8ff",

  // Bordas / linhas
  border: "#201f2c",
  divider: "#2a2a32",

  overlay: "rgba(0,0,0,0.55)",
};

export const gradients = {
  brand: ["#6C5CE7", "#5145FF", "#1809e0"],
  brandSoft: ["#2A2470", "#1c1c2e"],
  success: ["#2ED573", "#17A863"],
  danger: ["#FF6B6B", "#E23E3E"],
  navBar: ["rgba(24,24,32,0.97)", "rgba(12,12,16,0.99)"],
  fab: ["#7C6CFF", "#4800FF"],
  header: ["#171433", "#0f0f0f"],
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 28,
  pill: 999,
};

export const shadow = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  glowPrimary: {
    shadowColor: "#5145FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
};

export default { colors, gradients, radii, shadow };
