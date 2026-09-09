// Semantic colors shared by screens, forms, charts and navigation.
const brand = {
  primary: '#5145FF', primaryDark: '#1809e0', primaryDeep: '#4800FF',
  onPrimary: '#FFFFFF', onPrimaryMuted: '#E7E5FF', shadow: '#000000',
  featurePurple: '#4C4CF0', featureBlue: '#1479C9', featureViolet: '#7351DC', featureRed: '#D63545',
};

export const palettes = {
  escuro: {
    ...brand,
    background: '#0f0f0f', backgroundAlt: '#0f0f13', surface: '#1c1c1c',
    surfaceAlt: '#181820', surfaceElevated: '#26262E', surfaceMuted: '#161616', input: '#1b1b1b',
    textPrimary: '#F5F5FA', textSecondary: '#B8B8C8', textMuted: '#A5A5B5', placeholder: '#A0A0B0',
    textLink: '#B5ACFF', border: '#393943', divider: '#33333D',
    primarySoft: '#272240', success: '#2ED573', successSoft: '#173529',
    danger: '#FF7C87', dangerStrong: '#FF6B78', dangerSoft: '#3C2026', warning: '#FFC542',
    overlay: 'rgba(0,0,0,0.65)', pressed: 'rgba(255,255,255,0.08)', switchOff: '#626271',
    chartPurple: '#9B8CFF', chartBlue: '#6DBBFF', chartOrange: '#FFB45C',
  },
  claro: {
    ...brand,
    background: '#F4F5FA', backgroundAlt: '#FFFFFF', surface: '#FFFFFF',
    surfaceAlt: '#F0F1F8', surfaceElevated: '#E8EAF3', surfaceMuted: '#EEF0F7', input: '#EEF0F7',
    textPrimary: '#202136', textSecondary: '#54566F', textMuted: '#63657A', placeholder: '#686A7C',
    textLink: '#4C36C6', border: '#D1D4E2', divider: '#E0E2EC',
    primarySoft: '#EAE5FF', success: '#167345', successSoft: '#DDF3E6',
    danger: '#BC263A', dangerStrong: '#AF2034', dangerSoft: '#FBE4E8', warning: '#8D5A00',
    overlay: 'rgba(24,25,42,0.4)', pressed: 'rgba(81,69,255,0.08)', switchOff: '#9496A8',
    chartPurple: '#7754CB', chartBlue: '#1B70B5', chartOrange: '#B26108',
  },
};

export function isTheme(value) { return value === 'claro' || value === 'escuro'; }
