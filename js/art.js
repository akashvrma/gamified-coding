// ============================================================
// art.js — the illuminations. Original dark-fantasy figures and
// the journey map, drawn as inline SVG. Everything here is
// hand-drawn archetype art (hooded adepts, wraiths, fire-shadows)
// so the Codex evokes its mythologies without copying anyone.
// All figures are decorative: callers set aria-hidden.
// ============================================================

// ---------------- the adept (player avatar) ----------------
// Tier grows with rank: 0 novice → 1 eyes ignite → 2 the vessel
// manifests (wand raised / ring aura) → 3 runic aura → 4 ascended.

export function avatarTier(rankIndex) {
  if (rankIndex >= 11) return 4;
  if (rankIndex >= 8) return 3;
  if (rankIndex >= 5) return 2;
  if (rankIndex >= 2) return 1;
  return 0;
}

export const TIER_NAMES = [
  'The Hooded Novice',
  'The Kindled',
  'The Vessel-Bearer',
  'The Rune-Wreathed',
  'The Ascendant',
];

let avatarUid = 0;

export function avatarSvg(allegiance, tier) {
  const wand = allegiance !== 'ring';
  const glow = tier >= 1;
  const vessel = tier >= 2;
  const runes = tier >= 3;
  const ascended = tier >= 4;
  // Unique def ids per instance: header + Sanctum avatars coexist in one
  // document, and duplicate ids would make url(#...) resolve to the first.
  avatarUid += 1;
  const vid = `av-void-${avatarUid}`;
  const gid = `av-glow-${avatarUid}`;
  return `
  <svg class="avatar-svg tier-${tier}" viewBox="0 0 120 140" role="img" aria-hidden="true">
    <defs>
      <radialGradient id="${vid}" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#181c2b"/><stop offset="100%" stop-color="#07080d"/>
      </radialGradient>
      <filter id="${gid}" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur stdDeviation="2.2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    ${ascended ? `
      <g class="asc-shards" filter="url(#${gid})" opacity="0.85">
        <path d="M18 38 l6 -14 4 16 z" fill="var(--accent)"/>
        <path d="M98 30 l8 -10 2 16 z" fill="var(--accent)"/>
        <path d="M30 110 l-10 6 12 6 z" fill="var(--accent)"/>
        <path d="M96 106 l12 4 -8 10 z" fill="var(--accent)"/>
      </g>` : ''}
    ${runes ? `
      <g class="av-runes" fill="none" stroke="var(--accent)" stroke-width="1.4" opacity="0.7" filter="url(#${gid})">
        <circle cx="60" cy="66" r="52" stroke-dasharray="6 10"/>
      </g>` : ''}
    <!-- cloak -->
    <path d="M60 16 C40 16 30 34 28 52 C24 84 20 106 16 126 L104 126 C100 106 96 84 92 52 C90 34 80 16 60 16 Z"
      fill="url(#${vid})" stroke="#232738" stroke-width="2"/>
    <!-- hood cavity -->
    <path d="M60 26 C48 26 41 38 41 50 C41 62 49 70 60 70 C71 70 79 62 79 50 C79 38 72 26 60 26 Z"
      fill="#04050a"/>
    ${glow ? `
      <g class="av-eyes" filter="url(#${gid})">
        <ellipse cx="52.5" cy="52" rx="3.2" ry="${ascended ? 2.4 : 1.7}" fill="var(--accent-bright)"/>
        <ellipse cx="67.5" cy="52" rx="3.2" ry="${ascended ? 2.4 : 1.7}" fill="var(--accent-bright)"/>
      </g>` : `
      <g class="av-eyes-dim">
        <ellipse cx="52.5" cy="52" rx="2.2" ry="1" fill="#3a3f55"/>
        <ellipse cx="67.5" cy="52" rx="2.2" ry="1" fill="#3a3f55"/>
      </g>`}
    <!-- clasp -->
    <circle cx="60" cy="78" r="3.5" fill="none" stroke="${vessel ? 'var(--accent)' : '#2c3147'}" stroke-width="1.6"/>
    ${vessel && wand ? `
      <!-- raised wand arm -->
      <path d="M84 92 C93 82 100 70 104 56" fill="none" stroke="#232738" stroke-width="7" stroke-linecap="round"/>
      <line x1="103" y1="58" x2="112" y2="34" stroke="#0c0e16" stroke-width="3.4" stroke-linecap="round"/>
      <line x1="103" y1="58" x2="112" y2="34" stroke="#3a3049" stroke-width="1.6" stroke-linecap="round"/>
      <circle class="av-spark" cx="113" cy="31" r="${ascended ? 5 : 3.4}" fill="var(--accent-bright)" filter="url(#${gid})"/>` : ''}
    ${vessel && !wand ? `
      <!-- ring hand -->
      <path d="M84 94 C92 88 97 80 99 72" fill="none" stroke="#232738" stroke-width="7" stroke-linecap="round"/>
      <circle cx="100" cy="68" r="6.5" fill="none" stroke="var(--accent-bright)" stroke-width="2.4" filter="url(#${gid})" class="av-spark"/>
      ${ascended ? '<circle cx="100" cy="68" r="11" fill="none" stroke="var(--accent)" stroke-width="1" opacity="0.6" class="av-spark"/>' : ''}` : ''}
    <!-- hem shadow -->
    <path d="M16 126 L104 126 L104 132 L16 132 Z" fill="#04050a"/>
  </svg>`;
}

// ---------------- the wardens (bosses) ----------------
// Original archetypes: a gate-wraith, a fire-shadow, a drowned
// horde, a crowned wraith-king, and the Nameless One.

export function bossSvg(actId) {
  const art = {
    act1: `
      <g class="boss-sway">
        <path d="M100 22 C72 22 60 52 58 84 C56 116 48 150 36 178 C58 168 66 176 78 168 C88 176 96 172 100 178 C104 172 112 176 122 168 C134 176 142 168 164 178 C152 150 144 116 142 84 C140 52 128 22 100 22 Z"
          fill="#0b0d16" stroke="#1e2233" stroke-width="2"/>
        <path d="M100 40 C86 40 78 54 78 68 C78 82 88 92 100 92 C112 92 122 82 122 68 C122 54 114 40 100 40 Z" fill="#020308"/>
        <g class="boss-eyes"><ellipse cx="91" cy="66" rx="3" ry="4" fill="#9fd4ff"/><ellipse cx="109" cy="66" rx="3" ry="4" fill="#9fd4ff"/></g>
        <path class="boss-hand" d="M56 96 C44 104 36 116 34 128 C42 122 52 122 58 114" fill="none" stroke="#0b0d16" stroke-width="10" stroke-linecap="round"/>
        <path class="boss-hand" d="M144 96 C156 104 164 116 166 128 C158 122 148 122 142 114" fill="none" stroke="#0b0d16" stroke-width="10" stroke-linecap="round"/>
        <g opacity="0.5"><ellipse cx="100" cy="182" rx="70" ry="8" fill="#0e1420"/></g>
      </g>`,
    act2: `
      <g class="boss-sway">
        <g class="boss-flames" opacity="0.9">
          <path d="M52 60 C48 40 58 28 66 18 C66 34 76 38 74 52 Z" fill="#e8641f"/>
          <path d="M148 60 C152 40 142 28 134 18 C134 34 124 38 126 52 Z" fill="#e8641f"/>
          <path d="M96 34 C92 20 100 12 104 4 C106 18 114 22 110 34 Z" fill="#f0a13c"/>
        </g>
        <path d="M100 30 C70 34 56 58 54 86 C52 116 46 148 38 176 L162 176 C154 148 148 116 146 86 C144 58 130 34 100 30 Z"
          fill="#120a08" stroke="#33150c" stroke-width="2"/>
        <path d="M64 44 C52 34 44 22 42 10 C56 16 68 16 76 26 Z" fill="#120a08" stroke="#33150c" stroke-width="1.5"/>
        <path d="M136 44 C148 34 156 22 158 10 C144 16 132 16 124 26 Z" fill="#120a08" stroke="#33150c" stroke-width="1.5"/>
        <g class="boss-eyes"><path d="M82 70 l14 6 -14 4 z" fill="#ffb84d"/><path d="M118 70 l-14 6 14 4 z" fill="#ffb84d"/></g>
        <path d="M84 96 C92 102 108 102 116 96" fill="none" stroke="#e8641f" stroke-width="2" opacity="0.8"/>
        <path class="boss-hand" d="M150 92 C168 100 178 118 180 140 C170 130 158 128 152 116" fill="none" stroke="#120a08" stroke-width="11" stroke-linecap="round"/>
        <g opacity="0.6"><ellipse cx="100" cy="182" rx="76" ry="9" fill="#1a0d08"/></g>
      </g>`,
    act3: `
      <g class="boss-sway">
        ${[0, 1, 2, 3, 4].map((i) => `
        <g transform="translate(${18 + i * 34} ${34 + (i % 2) * 16})" opacity="${0.75 + (i % 3) * 0.1}">
          <path d="M16 24 C6 24 2 36 2 48 C2 74 -2 96 -6 118 L38 118 C34 96 30 74 30 48 C30 36 26 24 16 24 Z" fill="#0a1210" stroke="#16261f" stroke-width="1.5"/>
          <ellipse cx="16" cy="40" rx="8" ry="10" fill="#030705"/>
          <g class="boss-eyes"><circle cx="13" cy="39" r="1.6" fill="#7fd4b8"/><circle cx="19" cy="39" r="1.6" fill="#7fd4b8"/></g>
          <path class="boss-hand" d="M2 60 C-6 54 -10 44 -10 34" fill="none" stroke="#0a1210" stroke-width="6" stroke-linecap="round"/>
        </g>`).join('')}
        <g opacity="0.55"><ellipse cx="100" cy="176" rx="86" ry="10" fill="#071310"/></g>
      </g>`,
    act4: `
      <g class="boss-sway">
        <path d="M74 30 L84 8 L92 26 L100 4 L108 26 L116 8 L126 30 Z" fill="#171a26" stroke="#2b3044" stroke-width="1.5"/>
        <path d="M100 30 C74 32 62 56 60 86 C58 118 50 148 42 176 L158 176 C150 148 142 118 140 86 C138 56 126 32 100 30 Z"
          fill="#0a0c14" stroke="#22263a" stroke-width="2"/>
        <path d="M100 44 C88 44 80 56 80 68 C80 80 90 88 100 88 C110 88 120 80 120 68 C120 56 112 44 100 44 Z" fill="#020308"/>
        <g class="boss-eyes"><ellipse cx="92" cy="64" rx="2.6" ry="3.6" fill="#c9d6ff"/><ellipse cx="108" cy="64" rx="2.6" ry="3.6" fill="#c9d6ff"/></g>
        <path class="boss-hand" d="M146 90 C160 96 170 108 174 122" fill="none" stroke="#0a0c14" stroke-width="10" stroke-linecap="round"/>
        <line class="boss-blade" x1="172" y1="120" x2="192" y2="66" stroke="#3d4a6b" stroke-width="4" stroke-linecap="round"/>
        <line class="boss-blade" x1="172" y1="120" x2="192" y2="66" stroke="#8fa3d6" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
        <g opacity="0.6"><ellipse cx="100" cy="182" rx="78" ry="9" fill="#0b0e18"/></g>
      </g>`,
    act5: `
      <g class="boss-sway">
        <path d="M100 26 C76 30 66 52 64 80 C62 112 54 146 44 176 L156 176 C146 146 138 112 136 80 C134 52 124 30 100 26 Z"
          fill="#0c0a12" stroke="#241d33" stroke-width="2"/>
        <path d="M100 40 C87 40 79 52 79 65 C79 79 89 88 100 88 C111 88 121 79 121 65 C121 52 113 40 100 40 Z" fill="#030208"/>
        <g class="boss-eyes">
          <path d="M86 62 l10 3 -10 3 z" fill="#ff5f5f"/><path d="M114 62 l-10 3 10 3 z" fill="#ff5f5f"/>
          <path d="M96 76 q4 3 8 0" fill="none" stroke="#5c2440" stroke-width="1.6"/>
        </g>
        <path d="M97 70 q3 2 6 0" fill="none" stroke="#3d1b30" stroke-width="1.2"/>
        <g class="boss-shards" opacity="0.8">
          <path d="M40 60 q-14 -6 -18 -20 q16 2 22 12 z" fill="#1b1426"/>
          <path d="M160 60 q14 -6 18 -20 q-16 2 -22 12 z" fill="#1b1426"/>
        </g>
        <path class="boss-hand" d="M58 96 C46 106 40 120 38 134 C48 126 58 126 64 116" fill="none" stroke="#0c0a12" stroke-width="10" stroke-linecap="round"/>
        <path class="boss-hand" d="M142 96 C154 106 160 120 162 134 C152 126 142 126 136 116" fill="none" stroke="#0c0a12" stroke-width="10" stroke-linecap="round"/>
        <g opacity="0.6"><ellipse cx="100" cy="182" rx="80" ry="9" fill="#0e0a16"/></g>
      </g>`,
  };
  art.act6 = `
      <g class="boss-sway">
        <path d="M100 26 C78 28 68 48 66 76 C64 110 56 144 46 176 L154 176 C144 144 136 110 134 76 C132 48 122 28 100 26 Z"
          fill="#0d0f1d" stroke="#232a4a" stroke-width="2"/>
        <path d="M100 38 C88 38 80 50 80 63 C80 76 89 85 100 85 C111 85 120 76 120 63 C120 50 112 38 100 38 Z" fill="#04050c"/>
        <g class="boss-eyes"><ellipse cx="92" cy="60" rx="2.6" ry="3.4" fill="#9fb4ff"/><ellipse cx="108" cy="60" rx="2.6" ry="3.4" fill="#9fb4ff"/></g>
        <!-- cradled prophecy orb -->
        <path class="boss-hand" d="M70 100 C64 112 62 124 64 134" fill="none" stroke="#0d0f1d" stroke-width="9" stroke-linecap="round"/>
        <path class="boss-hand" d="M130 100 C136 112 138 124 136 134" fill="none" stroke="#0d0f1d" stroke-width="9" stroke-linecap="round"/>
        <circle cx="100" cy="126" r="20" fill="#0a0e1e" stroke="#3d4a7a" stroke-width="2"/>
        <circle class="boss-eyes" cx="100" cy="126" r="8" fill="#6f86d8" opacity="0.8"/>
        <circle cx="94" cy="120" r="2.5" fill="#c9d6ff" opacity="0.9"/>
        <g opacity="0.55"><ellipse cx="100" cy="182" rx="74" ry="9" fill="#0c1020"/></g>
      </g>`;
  art.act7 = `
      <g class="boss-sway">
        <path d="M100 30 C76 32 66 52 64 80 C62 112 54 146 44 176 L156 176 C146 146 138 112 136 80 C134 52 124 32 100 30 Z"
          fill="#120d10" stroke="#33202a" stroke-width="2"/>
        <!-- the seeing-stone held aloft -->
        <path class="boss-hand" d="M138 92 C150 80 158 66 160 52" fill="none" stroke="#120d10" stroke-width="9" stroke-linecap="round"/>
        <circle cx="163" cy="40" r="17" fill="#0c080e" stroke="#4a2330" stroke-width="2"/>
        <g class="boss-eyes">
          <ellipse cx="163" cy="40" rx="7" ry="9" fill="#e8641f" opacity="0.9"/>
          <ellipse cx="163" cy="40" rx="2" ry="7" fill="#120306"/>
        </g>
        <path d="M100 44 C88 44 80 56 80 69 C80 82 89 91 100 91 C111 91 120 82 120 69 C120 56 112 44 100 44 Z" fill="#040208"/>
        <g class="boss-eyes"><path d="M88 64 l10 3 -10 3 z" fill="#ff8f5f"/><path d="M112 64 l-10 3 10 3 z" fill="#ff8f5f"/></g>
        <path class="boss-hand" d="M62 96 C52 106 46 120 44 134 C54 126 62 126 68 116" fill="none" stroke="#120d10" stroke-width="10" stroke-linecap="round"/>
        <g opacity="0.55"><ellipse cx="100" cy="182" rx="76" ry="9" fill="#140b10"/></g>
      </g>`;
  art.act8 = `
      <g class="boss-sway">
        <!-- the Shadow of the Machine: an angular titan, self-assembled -->
        <path d="M100 24 L76 40 L72 78 L60 86 L58 176 L142 176 L140 86 L128 78 L124 40 Z"
          fill="#0b0e14" stroke="#2a3244" stroke-width="2"/>
        <path d="M84 44 L116 44 L112 70 L88 70 Z" fill="#040609"/>
        <g class="boss-eyes"><rect x="90" y="54" width="20" height="4" fill="#e8641f"/></g>
        <path d="M72 96 L60 96 L60 104 L72 104 Z M128 96 L140 96 L140 104 L128 104 Z" fill="#2a3244"/>
        <g class="boss-flames" opacity="0.7">
          <path d="M96 120 C94 112 98 106 100 100 C102 106 106 112 104 120 Z" fill="#e8641f"/>
        </g>
        <path class="boss-hand" d="M58 100 C42 108 34 124 32 142 C42 132 52 132 58 120" fill="none" stroke="#0b0e14" stroke-width="11" stroke-linecap="round"/>
        <path class="boss-hand" d="M142 100 C158 108 166 124 168 142 C158 132 148 132 142 120" fill="none" stroke="#0b0e14" stroke-width="11" stroke-linecap="round"/>
        <path d="M70 176 L74 156 L80 176 Z M120 176 L126 156 L130 176 Z" fill="#060810"/>
        <g opacity="0.55"><ellipse cx="100" cy="182" rx="80" ry="9" fill="#0a0e16"/></g>
      </g>`;
  return `
  <svg class="boss-svg" viewBox="0 0 200 192" role="img" aria-hidden="true">
    <defs>
      <filter id="boss-blur"><feGaussianBlur stdDeviation="0.4"/></filter>
    </defs>
    ${art[actId] || art.act1}
  </svg>`;
}

// ---------------- the journey map ----------------
// A winding descent through five regions. Fog covers what is
// sealed; a marker pulses where the learner stands.

const REGION_SPACING = 144;
const REGION_TOP = 64;

function regionVignette(actIndex, x, y) {
  const v = [
    // I — the shelves of the forbidden library
    `<g transform="translate(${x} ${y})" class="map-vig">
      <rect x="-34" y="-26" width="10" height="44" fill="#141021"/><rect x="-20" y="-34" width="10" height="52" fill="#181226"/>
      <rect x="-6" y="-28" width="10" height="46" fill="#141021"/><rect x="8" y="-36" width="10" height="54" fill="#181226"/>
      <rect x="22" y="-24" width="10" height="42" fill="#141021"/>
      <circle cx="30" cy="-30" r="2.4" fill="var(--accent-bright)" opacity="0.9"/>
    </g>`,
    // II — the mine gate under the mountain
    `<g transform="translate(${x} ${y})" class="map-vig">
      <path d="M-40 18 L-10 -34 L16 2 L34 -18 L52 18 Z" fill="#101321"/>
      <path d="M-14 18 L-2 -6 L10 18 Z" fill="#05060c"/>
      <path d="M-2 -5 v-6 m0 0 l-4 3 m4 -3 l4 3" stroke="#2a3147" stroke-width="1.6" fill="none"/>
    </g>`,
    // III — the veiled door of the mysteries
    `<g transform="translate(${x} ${y})" class="map-vig">
      <rect x="-16" y="-30" width="32" height="48" rx="14" fill="#0d1020"/>
      <path d="M-8 -24 C-2 -10 -2 6 -8 16 M0 -26 C4 -10 4 8 0 18 M8 -24 C12 -10 12 6 8 16" stroke="#252a44" stroke-width="2" fill="none"/>
      <circle cx="24" cy="-18" r="5" fill="none" stroke="#3a4064" stroke-width="1.4"/>
    </g>`,
    // IV — the mountain forge
    `<g transform="translate(${x} ${y})" class="map-vig">
      <path d="M-44 20 L0 -36 L44 20 Z" fill="#160d0c"/>
      <path d="M-7 -20 L0 -36 L7 -20 L0 -12 Z" fill="#e8641f" opacity="0.85"/>
      <path d="M0 -12 C2 -2 -2 6 0 18" stroke="#e8641f" stroke-width="2.4" fill="none" opacity="0.6"/>
    </g>`,
    // V — the hallows sigil under a dead star
    `<g transform="translate(${x} ${y})" class="map-vig">
      <circle cx="0" cy="-6" r="15" fill="none" stroke="#2c2440" stroke-width="2"/>
      <path d="M-15 8 L0 -20 L15 8 Z" fill="none" stroke="#2c2440" stroke-width="2"/>
      <line x1="0" y1="-20" x2="0" y2="8" stroke="#2c2440" stroke-width="2"/>
      <circle cx="26" cy="-30" r="3" fill="var(--accent-bright)" opacity="0.8"/>
    </g>`,
    // VI — the hall of prophecies: shelves of glowing orbs
    `<g transform="translate(${x} ${y})" class="map-vig">
      <rect x="-38" y="-32" width="76" height="4" fill="#151a2e"/>
      <rect x="-38" y="-12" width="76" height="4" fill="#151a2e"/>
      <rect x="-38" y="8" width="76" height="4" fill="#151a2e"/>
      ${[-28, -8, 12, 28].map((ox) => `<circle cx="${ox}" cy="-38" r="4" fill="#3d4a7a" opacity="0.9"/>`).join('')}
      ${[-22, 0, 22].map((ox) => `<circle cx="${ox}" cy="-18" r="4" fill="#3d4a7a" opacity="0.7"/>`).join('')}
      <circle cx="6" cy="-38" r="4.5" fill="var(--accent-bright)" opacity="0.85"/>
    </g>`,
    // VII — the seeing-stone on its plinth, lightning-crowned
    `<g transform="translate(${x} ${y})" class="map-vig">
      <path d="M-14 18 L-8 -2 L8 -2 L14 18 Z" fill="#141021"/>
      <circle cx="0" cy="-12" r="11" fill="#0d1020" stroke="#2c2440" stroke-width="2"/>
      <circle cx="0" cy="-12" r="4" fill="#e8641f" opacity="0.85"/>
      <path d="M-22 -34 l6 8 -5 1 6 9" fill="none" stroke="#3d4a7a" stroke-width="1.5"/>
      <path d="M22 -38 l-5 9 5 1 -6 8" fill="none" stroke="#3d4a7a" stroke-width="1.5"/>
    </g>`,
    // VIII — the last alliance: wand and sword crossed beneath twin banners
    `<g transform="translate(${x} ${y})" class="map-vig">
      <line x1="-16" y1="14" x2="14" y2="-24" stroke="#3d4a7a" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="16" y1="14" x2="-14" y2="-24" stroke="#7a5a3d" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="15" cy="-25" r="2.6" fill="var(--accent-bright)" opacity="0.9"/>
      <path d="M-30 -18 L-30 -44 L-20 -40 L-30 -36 Z" fill="#1c2438"/>
      <path d="M30 -18 L30 -44 L20 -40 L30 -36 Z" fill="#332014"/>
      <line x1="-30" y1="-18" x2="-30" y2="10" stroke="#232738" stroke-width="1.5"/>
      <line x1="30" y1="-18" x2="30" y2="10" stroke="#232738" stroke-width="1.5"/>
    </g>`,
  ];
  return v[actIndex % v.length];
}

// progress: [{unlocked, done, total, current}] per act, plus name.
export function mapSvg(progress) {
  const nodes = progress.map((p, i) => {
    const y = REGION_TOP + i * REGION_SPACING;
    const x = i % 2 === 0 ? 120 : 360;
    return { ...p, x, y, i };
  });
  const mapH = REGION_TOP + (progress.length - 1) * REGION_SPACING + 80;
  const path = nodes.map((n, i) => (i === 0
    ? `M ${n.x} ${n.y}`
    : `C ${nodes[i - 1].x} ${nodes[i - 1].y + 80}, ${n.x} ${n.y - 80}, ${n.x} ${n.y}`)).join(' ');
  const current = nodes.find((n) => n.current) || nodes[0];

  return `
  <svg class="map-svg" viewBox="0 0 480 ${mapH}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="map-fog-g" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#0a0c14" stop-opacity="0.72"/>
        <stop offset="100%" stop-color="#0a0c14" stop-opacity="0.25"/>
      </radialGradient>
      <filter id="map-glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect x="0" y="0" width="480" height="${mapH}" fill="none"/>
    <path d="${path}" fill="none" stroke="#232738" stroke-width="3" stroke-dasharray="1 10" stroke-linecap="round"/>
    ${nodes.map((n) => `
      ${regionVignette(n.i, n.x + (n.i % 2 === 0 ? 150 : -150), n.y)}
      <g class="map-node ${n.unlocked ? 'open' : 'sealed'}" transform="translate(${n.x} ${n.y})">
        <circle r="22" fill="#0d0f17" stroke="${n.unlocked ? 'var(--accent)' : '#232738'}" stroke-width="2"/>
        <text y="7" text-anchor="middle" font-size="20" fill="${n.unlocked ? 'var(--accent-bright)' : '#3a3f55'}"
          font-family="Georgia, serif">${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][n.i] || n.i + 1}</text>
        ${n.done === n.total ? '<circle r="28" fill="none" stroke="var(--success)" stroke-width="1.6" opacity="0.8"/>' : ''}
      </g>
      ${!n.unlocked ? `<ellipse cx="${n.x + (n.i % 2 === 0 ? 75 : -75)}" cy="${n.y}" rx="230" ry="76" fill="url(#map-fog-g)" class="map-fog"/>` : ''}
    `).join('')}
    <g transform="translate(${current.x} ${current.y - 40})" filter="url(#map-glow)">
      <g class="map-here"><path d="M0 12 L-7 -2 L0 -8 L7 -2 Z" fill="var(--accent-bright)"/></g>
    </g>
  </svg>`;
}
