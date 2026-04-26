import React from 'react';

const Base = ({ children }) => (
  <svg viewBox="0 0 100 140" width="100%" height="100%">
    {/* Head */}
    <circle cx="50" cy="28" r="18" fill="#FFD3B6" />
    <circle cx="43" cy="25" r="2.5" fill="#333" />
    <circle cx="57" cy="25" r="2.5" fill="#333" />
    <path d="M43 33 Q50 39 57 33" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 22 Q34 8 50 8 Q66 8 68 22" fill="#4A3728" />
    {children}
  </svg>
);

const SkinArms = () => <>
  <line x1="30" y1="55" x2="22" y2="75" stroke="#FFD3B6" strokeWidth="5" strokeLinecap="round" />
  <line x1="70" y1="55" x2="78" y2="75" stroke="#FFD3B6" strokeWidth="5" strokeLinecap="round" />
</>;

const SleeveArms = ({ color }) => <>
  <line x1="30" y1="55" x2="22" y2="75" stroke={color} strokeWidth="6" strokeLinecap="round" />
  <line x1="70" y1="55" x2="78" y2="75" stroke={color} strokeWidth="6" strokeLinecap="round" />
  <circle cx="22" cy="75" r="4" fill="#FFD3B6" />
  <circle cx="78" cy="75" r="4" fill="#FFD3B6" />
</>;

const GloveArms = ({ coatColor, gloveColor }) => <>
  <line x1="30" y1="55" x2="22" y2="75" stroke={coatColor} strokeWidth="6" strokeLinecap="round" />
  <line x1="70" y1="55" x2="78" y2="75" stroke={coatColor} strokeWidth="6" strokeLinecap="round" />
  <circle cx="22" cy="75" r="5" fill={gloveColor} />
  <circle cx="78" cy="75" r="5" fill={gloveColor} />
</>;

const Boots = ({ color }) => <>
  <rect x="30" y="104" width="18" height="12" rx="6" fill={color} />
  <rect x="52" y="104" width="18" height="12" rx="6" fill={color} />
</>;

const Sneakers = ({ color }) => <>
  <rect x="32" y="106" width="16" height="8" rx="4" fill={color} />
  <rect x="52" y="106" width="16" height="8" rx="4" fill={color} />
</>;

const Sandals = () => <>
  <rect x="33" y="90" width="14" height="6" rx="3" fill="#8B4513" />
  <rect x="53" y="90" width="14" height="6" rx="3" fill="#8B4513" />
  <line x1="37" y1="90" x2="37" y2="96" stroke="#A0522D" strokeWidth="1.5" />
  <line x1="43" y1="90" x2="43" y2="96" stroke="#A0522D" strokeWidth="1.5" />
  <line x1="57" y1="90" x2="57" y2="96" stroke="#A0522D" strokeWidth="1.5" />
  <line x1="63" y1="90" x2="63" y2="96" stroke="#A0522D" strokeWidth="1.5" />
</>;

const outfits = {
  // Snow: red puffy coat, beanie with pompom, scarf, snow pants, brown boots
  snow: (
    <Base>
      {/* Beanie */}
      <rect x="30" y="6" width="40" height="10" rx="5" fill="#E74C3C" />
      <circle cx="50" cy="4" r="4" fill="#fff" />
      <rect x="28" y="14" width="44" height="4" rx="2" fill="#C0392B" />
      {/* Scarf */}
      <rect x="34" y="44" width="32" height="6" rx="3" fill="#F1C40F" />
      <rect x="56" y="44" width="8" height="16" rx="3" fill="#F1C40F" />
      {/* Puffy coat */}
      <rect x="28" y="48" width="44" height="36" rx="8" fill="#E74C3C" />
      <line x1="50" y1="50" x2="50" y2="84" stroke="#C0392B" strokeWidth="1.5" />
      <circle cx="50" cy="56" r="2" fill="#C0392B" />
      <circle cx="50" cy="64" r="2" fill="#C0392B" />
      <circle cx="50" cy="72" r="2" fill="#C0392B" />
      <GloveArms coatColor="#E74C3C" gloveColor="#2C3E50" />
      {/* Snow pants */}
      <rect x="34" y="84" width="12" height="24" rx="4" fill="#2C3E50" />
      <rect x="54" y="84" width="12" height="24" rx="4" fill="#2C3E50" />
      <Boots color="#8B4513" />
    </Base>
  ),

  // Cold rain: yellow raincoat with hood, buttons, yellow rain boots
  coldRain: (
    <Base>
      {/* Hood */}
      <path d="M28 16 Q30 6 50 6 Q70 6 72 16" fill="#F1C40F" stroke="#D4AC0D" strokeWidth="1" />
      {/* Raincoat */}
      <rect x="28" y="46" width="44" height="38" rx="6" fill="#F1C40F" />
      <line x1="50" y1="48" x2="50" y2="84" stroke="#D4AC0D" strokeWidth="1.5" />
      <circle cx="46" cy="56" r="2" fill="#D4AC0D" />
      <circle cx="46" cy="64" r="2" fill="#D4AC0D" />
      <circle cx="46" cy="72" r="2" fill="#D4AC0D" />
      {/* Flap */}
      <rect x="48" y="48" width="12" height="36" rx="2" fill="#D4AC0D" opacity="0.3" />
      <SleeveArms color="#F1C40F" />
      <rect x="34" y="84" width="12" height="24" rx="4" fill="#2C3E50" />
      <rect x="54" y="84" width="12" height="24" rx="4" fill="#2C3E50" />
      <Boots color="#F1C40F" />
    </Base>
  ),

  // Warm rain: blue raincoat, hood, blue rain boots
  rain: (
    <Base>
      {/* Hood */}
      <path d="M28 16 Q30 6 50 6 Q70 6 72 16" fill="#3498DB" stroke="#2980B9" strokeWidth="1" />
      {/* Raincoat */}
      <rect x="28" y="46" width="44" height="38" rx="6" fill="#3498DB" />
      <line x1="50" y1="48" x2="50" y2="84" stroke="#2980B9" strokeWidth="1.5" />
      <circle cx="46" cy="56" r="2" fill="#2980B9" />
      <circle cx="46" cy="64" r="2" fill="#2980B9" />
      <circle cx="46" cy="72" r="2" fill="#2980B9" />
      <rect x="48" y="48" width="12" height="36" rx="2" fill="#2980B9" opacity="0.3" />
      <SleeveArms color="#3498DB" />
      <rect x="34" y="84" width="12" height="24" rx="4" fill="#2C3E50" />
      <rect x="54" y="84" width="12" height="24" rx="4" fill="#2C3E50" />
      <Boots color="#3498DB" />
    </Base>
  ),

  // Freezing: dark heavy parka, beanie, scarf, gloves, boots
  freezing: (
    <Base>
      {/* Beanie */}
      <rect x="30" y="6" width="40" height="10" rx="5" fill="#2C3E50" />
      <circle cx="50" cy="4" r="4" fill="#95A5A6" />
      <rect x="28" y="14" width="44" height="4" rx="2" fill="#95A5A6" />
      {/* Scarf */}
      <rect x="34" y="44" width="32" height="6" rx="3" fill="#E74C3C" />
      <rect x="34" y="44" width="8" height="16" rx="3" fill="#E74C3C" />
      {/* Heavy parka */}
      <rect x="26" y="48" width="48" height="40" rx="8" fill="#2C3E50" />
      <line x1="50" y1="50" x2="50" y2="88" stroke="#1A252F" strokeWidth="2" />
      <rect x="36" y="68" width="10" height="8" rx="2" fill="none" stroke="#1A252F" strokeWidth="1" />
      <rect x="54" y="68" width="10" height="8" rx="2" fill="none" stroke="#1A252F" strokeWidth="1" />
      {/* Fur trim at bottom */}
      <rect x="26" y="84" width="48" height="4" rx="2" fill="#95A5A6" />
      <GloveArms coatColor="#2C3E50" gloveColor="#E74C3C" />
      <rect x="34" y="88" width="12" height="20" rx="4" fill="#2C3E50" />
      <rect x="54" y="88" width="12" height="20" rx="4" fill="#2C3E50" />
      <Boots color="#8B4513" />
    </Base>
  ),

  // Cold: purple winter coat with collar, buttons, dark pants
  cold: (
    <Base>
      {/* Collar */}
      <rect x="36" y="44" width="28" height="6" rx="3" fill="#7D3C98" />
      {/* Winter coat */}
      <rect x="28" y="46" width="44" height="38" rx="6" fill="#8E44AD" />
      <line x1="50" y1="50" x2="50" y2="84" stroke="#7D3C98" strokeWidth="1.5" />
      <circle cx="46" cy="56" r="2" fill="#6C3483" />
      <circle cx="46" cy="64" r="2" fill="#6C3483" />
      <circle cx="46" cy="72" r="2" fill="#6C3483" />
      <rect x="33" y="66" width="10" height="8" rx="2" fill="none" stroke="#7D3C98" strokeWidth="1" />
      <rect x="57" y="66" width="10" height="8" rx="2" fill="none" stroke="#7D3C98" strokeWidth="1" />
      <SleeveArms color="#8E44AD" />
      <rect x="34" y="84" width="12" height="26" rx="4" fill="#2C3E50" />
      <rect x="54" y="84" width="12" height="26" rx="4" fill="#2C3E50" />
      <Sneakers color="#7F8C8D" />
    </Base>
  ),

  // Cool: green zip-up jacket, collar, zipper, pockets
  cool: (
    <Base>
      {/* Collar */}
      <path d="M42 46 L50 54 L58 46" fill="none" stroke="#1E8449" strokeWidth="2.5" />
      {/* Jacket */}
      <rect x="30" y="46" width="40" height="35" rx="6" fill="#27AE60" />
      <line x1="50" y1="54" x2="50" y2="81" stroke="#BDC3C7" strokeWidth="1.5" />
      <rect x="33" y="64" width="10" height="8" rx="2" fill="none" stroke="#1E8449" strokeWidth="1" />
      <rect x="57" y="64" width="10" height="8" rx="2" fill="none" stroke="#1E8449" strokeWidth="1" />
      <SleeveArms color="#27AE60" />
      <rect x="34" y="81" width="12" height="28" rx="4" fill="#2C3E50" />
      <rect x="54" y="81" width="12" height="28" rx="4" fill="#2C3E50" />
      <Sneakers color="#7F8C8D" />
    </Base>
  ),

  // Mild: light blue long-sleeve shirt with collar, jeans, white sneakers
  mild: (
    <Base>
      {/* Collar */}
      <path d="M44 46 L50 50 L56 46" fill="none" stroke="#2980B9" strokeWidth="2" />
      {/* Shirt */}
      <rect x="30" y="46" width="40" height="32" rx="6" fill="#3498DB" />
      {/* Buttons */}
      <circle cx="50" cy="54" r="1.5" fill="#2980B9" />
      <circle cx="50" cy="60" r="1.5" fill="#2980B9" />
      <circle cx="50" cy="66" r="1.5" fill="#2980B9" />
      <SleeveArms color="#3498DB" />
      <rect x="34" y="78" width="12" height="30" rx="4" fill="#5D6D7E" />
      <rect x="54" y="78" width="12" height="30" rx="4" fill="#5D6D7E" />
      <Sneakers color="#fff" />
    </Base>
  ),

  // Warm: orange t-shirt (short sleeves visible), jeans, sunglasses
  warm: (
    <Base>
      {/* Sunglasses */}
      <rect x="37" y="22" width="10" height="6" rx="2" fill="#333" />
      <rect x="53" y="22" width="10" height="6" rx="2" fill="#333" />
      <line x1="47" y1="25" x2="53" y2="25" stroke="#333" strokeWidth="1.5" />
      {/* T-shirt */}
      <rect x="30" y="46" width="40" height="28" rx="6" fill="#F39C12" />
      {/* Short sleeves */}
      <rect x="22" y="46" width="14" height="12" rx="4" fill="#F39C12" />
      <rect x="64" y="46" width="14" height="12" rx="4" fill="#F39C12" />
      {/* Collar */}
      <path d="M44 46 Q50 50 56 46" fill="none" stroke="#E67E22" strokeWidth="1.5" />
      <SkinArms />
      <rect x="34" y="74" width="12" height="30" rx="4" fill="#5D6D7E" />
      <rect x="54" y="74" width="12" height="30" rx="4" fill="#5D6D7E" />
      <Sneakers color="#fff" />
    </Base>
  ),

  // Hot: red tank top, khaki shorts, sunglasses, sandals
  hot: (
    <Base>
      {/* Sunglasses */}
      <rect x="37" y="22" width="10" height="6" rx="2" fill="#333" />
      <rect x="53" y="22" width="10" height="6" rx="2" fill="#333" />
      <line x1="47" y1="25" x2="53" y2="25" stroke="#333" strokeWidth="1.5" />
      {/* Tank top */}
      <rect x="34" y="46" width="32" height="24" rx="4" fill="#E74C3C" />
      {/* Straps */}
      <rect x="36" y="44" width="8" height="4" rx="2" fill="#E74C3C" />
      <rect x="56" y="44" width="8" height="4" rx="2" fill="#E74C3C" />
      <SkinArms />
      {/* Shorts */}
      <rect x="34" y="70" width="12" height="16" rx="4" fill="#F5CBA7" />
      <rect x="54" y="70" width="12" height="16" rx="4" fill="#F5CBA7" />
      {/* Skin legs below shorts */}
      <line x1="40" y1="86" x2="40" y2="92" stroke="#FFD3B6" strokeWidth="8" strokeLinecap="round" />
      <line x1="60" y1="86" x2="60" y2="92" stroke="#FFD3B6" strokeWidth="8" strokeLinecap="round" />
      <Sandals />
    </Base>
  ),
};

export default function DressUpKid({ weatherCode, temp }) {
  const rain = weatherCode >= 200 && weatherCode < 600;
  const snow = weatherCode >= 600 && weatherCode < 700;
  let key = 'warm';
  if (snow) key = 'snow';
  else if (rain && temp < 50) key = 'coldRain';
  else if (rain) key = 'rain';
  else if (temp < 32) key = 'freezing';
  else if (temp < 45) key = 'cold';
  else if (temp < 55) key = 'cool';
  else if (temp < 65) key = 'mild';
  else if (temp < 75) key = 'warm';
  else key = 'hot';

  return <div className="dress-kid">{outfits[key]}</div>;
}
