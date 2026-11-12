// Zodiac sign reference data.
// `start` / `end` are [month, day] (1-based month), inclusive.

export const SIGNS = [
  {
    id: 'aries', name: 'Aries', symbol: '♈', start: [3, 21], end: [4, 19],
    element: 'Fire', modality: 'Cardinal', ruler: 'Mars',
    traits: ['Bold', 'Energetic', 'Pioneering', 'Direct'],
    strengths: 'Courageous, determined, confident, enthusiastic, honest.',
    weaknesses: 'Impatient, moody, short-tempered, impulsive.',
    summary: 'The first sign of the zodiac, Aries charges headfirst into life with fearless energy and a love of new beginnings.',
  },
  {
    id: 'taurus', name: 'Taurus', symbol: '♉', start: [4, 20], end: [5, 20],
    element: 'Earth', modality: 'Fixed', ruler: 'Venus',
    traits: ['Grounded', 'Loyal', 'Sensual', 'Patient'],
    strengths: 'Reliable, patient, practical, devoted, stable.',
    weaknesses: 'Stubborn, possessive, uncompromising.',
    summary: 'Taurus savors life’s pleasures and builds lasting security with steady, unshakeable determination.',
  },
  {
    id: 'gemini', name: 'Gemini', symbol: '♊', start: [5, 21], end: [6, 20],
    element: 'Air', modality: 'Mutable', ruler: 'Mercury',
    traits: ['Curious', 'Witty', 'Adaptable', 'Social'],
    strengths: 'Gentle, affectionate, curious, adaptable, quick learner.',
    weaknesses: 'Nervous, inconsistent, indecisive.',
    summary: 'Gemini’s quicksilver mind thrives on conversation, ideas and the endless variety the world offers.',
  },
  {
    id: 'cancer', name: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22],
    element: 'Water', modality: 'Cardinal', ruler: 'Moon',
    traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional'],
    strengths: 'Tenacious, imaginative, loyal, sympathetic, persuasive.',
    weaknesses: 'Moody, pessimistic, suspicious, insecure.',
    summary: 'Guided by the Moon, Cancer leads with the heart and creates a safe harbor for those it loves.',
  },
  {
    id: 'leo', name: 'Leo', symbol: '♌', start: [7, 23], end: [8, 22],
    element: 'Fire', modality: 'Fixed', ruler: 'Sun',
    traits: ['Radiant', 'Generous', 'Dramatic', 'Proud'],
    strengths: 'Creative, passionate, generous, warm-hearted, cheerful.',
    weaknesses: 'Arrogant, stubborn, self-centered, lazy.',
    summary: 'Ruled by the Sun, Leo shines brightest center stage, warming everyone with big-hearted charisma.',
  },
  {
    id: 'virgo', name: 'Virgo', symbol: '♍', start: [8, 23], end: [9, 22],
    element: 'Earth', modality: 'Mutable', ruler: 'Mercury',
    traits: ['Analytical', 'Helpful', 'Precise', 'Modest'],
    strengths: 'Loyal, analytical, kind, hardworking, practical.',
    weaknesses: 'Shy, worry-prone, overly critical.',
    summary: 'Virgo finds magic in the details, quietly perfecting the world one thoughtful act at a time.',
  },
  {
    id: 'libra', name: 'Libra', symbol: '♎', start: [9, 23], end: [10, 22],
    element: 'Air', modality: 'Cardinal', ruler: 'Venus',
    traits: ['Harmonious', 'Diplomatic', 'Charming', 'Fair'],
    strengths: 'Cooperative, diplomatic, gracious, fair-minded, social.',
    weaknesses: 'Indecisive, avoids confrontation, self-pitying.',
    summary: 'Libra seeks balance and beauty in all things, weaving harmony between people and ideas.',
  },
  {
    id: 'scorpio', name: 'Scorpio', symbol: '♏', start: [10, 23], end: [11, 21],
    element: 'Water', modality: 'Fixed', ruler: 'Pluto & Mars',
    traits: ['Intense', 'Magnetic', 'Loyal', 'Mysterious'],
    strengths: 'Resourceful, brave, passionate, stubborn, a true friend.',
    weaknesses: 'Distrusting, jealous, secretive, violent.',
    summary: 'Scorpio dives into life’s depths, transforming everything it touches with fierce, magnetic passion.',
  },
  {
    id: 'sagittarius', name: 'Sagittarius', symbol: '♐', start: [11, 22], end: [12, 21],
    element: 'Fire', modality: 'Mutable', ruler: 'Jupiter',
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Free'],
    strengths: 'Generous, idealistic, great sense of humor.',
    weaknesses: 'Promises more than can deliver, impatient, tactless.',
    summary: 'The archer aims for distant horizons — Sagittarius lives for truth, travel and wide-open freedom.',
  },
  {
    id: 'capricorn', name: 'Capricorn', symbol: '♑', start: [12, 22], end: [1, 19],
    element: 'Earth', modality: 'Cardinal', ruler: 'Saturn',
    traits: ['Ambitious', 'Disciplined', 'Wise', 'Steady'],
    strengths: 'Responsible, disciplined, self-controlled, good managers.',
    weaknesses: 'Know-it-all, unforgiving, condescending, pessimistic.',
    summary: 'Capricorn climbs every mountain with patience and grit, building legacies that stand the test of time.',
  },
  {
    id: 'aquarius', name: 'Aquarius', symbol: '♒', start: [1, 20], end: [2, 18],
    element: 'Air', modality: 'Fixed', ruler: 'Uranus & Saturn',
    traits: ['Inventive', 'Independent', 'Humanitarian', 'Quirky'],
    strengths: 'Progressive, original, independent, humanitarian.',
    weaknesses: 'Runs from emotional expression, temperamental, aloof.',
    summary: 'Aquarius dreams of the future, championing originality and the greater good with visionary spark.',
  },
  {
    id: 'pisces', name: 'Pisces', symbol: '♓', start: [2, 19], end: [3, 20],
    element: 'Water', modality: 'Mutable', ruler: 'Neptune & Jupiter',
    traits: ['Dreamy', 'Compassionate', 'Artistic', 'Intuitive'],
    strengths: 'Compassionate, artistic, intuitive, gentle, wise, musical.',
    weaknesses: 'Fearful, overly trusting, sad, desire to escape reality.',
    summary: 'Pisces swims between worlds, blending deep empathy with boundless imagination.',
  },
];

export const ELEMENT_COLORS = {
  Fire: '#ff8a5c',
  Earth: '#9ccc65',
  Air: '#7ec8ff',
  Water: '#b39dff',
};

export const getSign = (id) => SIGNS.find((s) => s.id === id);
