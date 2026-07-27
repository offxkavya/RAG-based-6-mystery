export interface QuizQuestion {
  id: string;
  category: 'cations' | 'anions' | 'titrations' | 'organic_tests' | 'colloids' | 'kinetics';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface StudentMastery {
  cations: number; // Probability of mastery P(L) in [0, 1]
  anions: number;
  titrations: number;
  organic_tests: number;
  colloids: number;
  kinetics: number;
}

// BKT Model Parameters
const P_INIT = 0.15;  // Initial probability of knowing the concept
const P_T = 0.20;    // Transition: probability of learning if not mastered
const P_G = 0.25;    // Guess: probability of answering correctly if NOT mastered
const P_S = 0.10;    // Slip: probability of answering incorrectly if mastered

/**
 * Predefined database of CBSE/ISC chemistry practical questions
 */
export const VIVA_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q_cat_1',
    category: 'cations',
    question: 'Why does Lead chloride (PbCl2) precipitate dissolve on heating?',
    options: [
      'It decomposes into lead metal and chlorine gas',
      'Its solubility product (Ksp) increases significantly with temperature',
      'It reacts with water to form soluble lead hydroxide',
      'Hydrochloric acid evaporates on heating'
    ],
    correctAnswerIndex: 1,
    explanation: 'Lead chloride has a relatively high solubility in hot water compared to cold water. Heating the solution increases the kinetic energy and solubility, causing the precipitate to dissolve.'
  },
  {
    id: 'q_cat_2',
    category: 'cations',
    question: 'Which reagent produces a cherry-red precipitate with Ni2+ ions in alkaline medium?',
    options: [
      'Potassium Ferrocyanide',
      'Nessler\'s Reagent',
      'Dimethylglyoxime (DMG)',
      'Ammonium Oxalate'
    ],
    correctAnswerIndex: 2,
    explanation: 'Dimethylglyoxime (DMG) reacts with nickel(II) ions in a solution buffered with ammonium hydroxide to precipitate bright cherry-red nickel dimethylglyoximate.'
  },
  {
    id: 'q_cat_3',
    category: 'cations',
    question: 'Why is Ammonium Chloride (NH4Cl) added BEFORE Ammonium Hydroxide (NH4OH) in Group III cation analysis?',
    options: [
      'To increase the hydroxide (OH-) ion concentration',
      'To oxidize iron(II) to iron(III) ions',
      'To suppress the dissociation of NH4OH by the common ion effect',
      'To act as a catalyst for precipitation'
    ],
    correctAnswerIndex: 2,
    explanation: 'Adding NH4Cl provides excess NH4+ ions, which shifts the NH4OH dissociation equilibrium backward (common ion effect). This reduces the OH- concentration so that only the highly insoluble Group III hydroxides (Fe3+, Al3+) precipitate, while the more soluble Group IV and V hydroxides remain in solution.'
  },
  {
    id: 'q_cat_4',
    category: 'cations',
    question: 'Nessler\'s reagent is used to confirm the presence of which cation?',
    options: [
      'Pb2+',
      'NH4+',
      'Cu2+',
      'Mg2+'
    ],
    correctAnswerIndex: 1,
    explanation: 'Nessler\'s reagent (alkaline solution of potassium tetraiodomercurate(II)) reacts with ammonium ions (NH4+) to form a characteristic brown precipitate of basic mercury(II) amido-iodide.'
  },
  {
    id: 'q_cat_5',
    category: 'cations',
    question: 'What is the composition of the blue "lake" formed in the confirmatory test for Al3+?',
    options: [
      'Al2O3 dissolved in litmus solution',
      'Litmus dye adsorbed onto the surface of Al(OH)3 precipitate',
      'A coordination compound [Al(Litmus)6]3+',
      'Copper sulfate impurity'
    ],
    correctAnswerIndex: 1,
    explanation: 'Aluminum hydroxide is a gelatinous precipitate. In the lake test, it physically adsorbs the blue litmus dye molecules onto its surface, concentrating the color into a floating blue mass called a lake.'
  },
  {
    id: 'q_ani_1',
    category: 'anions',
    question: 'Which gas is evolved with brisk effervescence when dilute acid is added to a carbonate salt?',
    options: [
      'Hydrogen Sulfide (H2S)',
      'Sulfur Dioxide (SO2)',
      'Carbon Dioxide (CO2)',
      'Nitrogen Dioxide (NO2)'
    ],
    correctAnswerIndex: 2,
    explanation: 'Carbonates react with dilute acids to release Carbon Dioxide (CO2) gas, which is colorless, odorless, and causes rapid bubbling (brisk effervescence).'
  },
  {
    id: 'q_ani_2',
    category: 'anions',
    question: 'Why does freshly prepared Ferrous Sulfate (FeSO4) solution have to be used in the Nitrate Brown Ring test?',
    options: [
      'FeSO4 decomposes into FeO on standing',
      'Fe2+ ions oxidize to Fe3+ in air, which cannot form the brown nitroso complex',
      'Concentrated H2SO4 requires cold FeSO4 to avoid explosions',
      'FeSO4 loses its water of crystallization'
    ],
    correctAnswerIndex: 1,
    explanation: 'The brown ring is formed by the coordination complex [Fe(H2O)5(NO)]2+, which requires Fe2+ (ferrous) ions. Atmospheric oxygen oxidizes aqueous Fe2+ to Fe3+ (ferric) over time, rendering old solutions ineffective.'
  },
  {
    id: 'q_ani_3',
    category: 'anions',
    question: 'Which precipitate is completely insoluble in Ammonium Hydroxide (NH4OH) solution?',
    options: [
      'Silver Chloride (AgCl)',
      'Silver Bromide (AgBr)',
      'Silver Iodide (AgI)',
      'Calcium Carbonate (CaCO3)'
    ],
    correctAnswerIndex: 2,
    explanation: 'Silver Iodide (AgI) is extremely insoluble (lowest solubility product among silver halides) and does not dissolve in ammonium hydroxide. AgCl is completely soluble, and AgBr is sparingly soluble.'
  },
  {
    id: 'q_ani_4',
    category: 'anions',
    question: 'Which gas is released during the acid test of a sulfide salt and turns lead acetate paper black?',
    options: [
      'SO2',
      'H2S',
      'CO2',
      'NO2'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sulfide salts react with dilute acids to release Hydrogen Sulfide (H2S) gas. Evolved H2S reacts with lead acetate on the test paper to form black, insoluble Lead Sulfide (PbS).'
  },
  {
    id: 'q_tit_1',
    category: 'titrations',
    question: 'Why is the Oxalic Acid solution heated to 60-70°C before titrating with KMnO4?',
    options: [
      'To prevent the oxidation of oxalic acid by air',
      'To drive off dissolved carbon dioxide gas',
      'To provide the necessary activation energy for the slow redox reaction',
      'To melt the oxalic acid crystals'
    ],
    correctAnswerIndex: 2,
    explanation: 'The reaction between oxalic acid and potassium permanganate is slow at room temperature. Heating to 60-70°C accelerates the reaction rate by providing activation energy. Once started, Mn2+ ions act as a catalyst.'
  },
  {
    id: 'q_tit_2',
    category: 'titrations',
    question: 'Why is hydrochloric acid (HCl) NOT used to acidify the solution in KMnO4 titrations?',
    options: [
      'HCl makes the endpoint too acidic',
      'KMnO4 oxidizes HCl to release toxic Chlorine gas, consuming permanganate ions',
      'HCl precipitates Mohr\'s salt',
      'HCl decomposes the permanganate complex into manganese dioxide'
    ],
    correctAnswerIndex: 1,
    explanation: 'Hydrochloric acid reacts with KMnO4 (a strong oxidizer) to form chlorine gas (Cl2). This reaction consumes KMnO4, resulting in incorrect titration volumes. Dilute Sulfuric Acid is used instead because sulfate ions are not oxidizable.'
  },
  {
    id: 'q_tit_3',
    category: 'titrations',
    question: 'What is the role of KMnO4 in redox titrations against Mohr\'s salt?',
    options: [
      'Reducing agent and external indicator',
      'Oxidizing agent and self-indicator',
      'Catalyst and buffering agent',
      'Dehydrating agent'
    ],
    correctAnswerIndex: 1,
    explanation: 'KMnO4 is a strong oxidizing agent. Because of its intense purple color (which turns colorless upon reduction to Mn2+), the first drop of excess KMnO4 imparts a persistent pale pink color, making it a self-indicator.'
  },
  {
    id: 'q_col_1',
    category: 'colloids',
    question: 'Which of the following is an example of a lyophobic (liquid-hating) colloid?',
    options: [
      'Starch Sol',
      'Egg Albumin Sol',
      'Ferric Hydroxide Sol',
      'Gelatin Sol'
    ],
    correctAnswerIndex: 2,
    explanation: 'Ferric Hydroxide Sol is a lyophobic sol. It has little affinity for the water solvent and must be prepared by a chemical method (hydrolysis of FeCl3). Starch and egg albumin are lyophilic and form sols easily.'
  },
  {
    id: 'q_kin_1',
    category: 'kinetics',
    question: 'In the starch-iodine clock reaction, what causes the sudden appearance of the dark blue-black color?',
    options: [
      'The oxidation of starch by iodate',
      'The complexation of free iodine (I2) with starch once the reducing agent (bisulfite) is fully consumed',
      'The precipitation of sodium bisulfite',
      'The heating of the solution'
    ],
    correctAnswerIndex: 1,
    explanation: 'Iodine is continuously reduced back to iodide by bisulfite as long as bisulfite is present. The moment bisulfite runs out, free iodine (I2) accumulates and instantly reacts with starch to form the intense blue-black starch-iodine complex.'
  }
];

/**
 * Returns baseline mastery probabilities for new students.
 */
export function getInitialMastery(): StudentMastery {
  return {
    cations: P_INIT,
    anions: P_INIT,
    titrations: P_INIT,
    organic_tests: P_INIT,
    colloids: P_INIT,
    kinetics: P_INIT
  };
}

// BKT update formula
export function updateMastery(
  currentMastery: number, 
  isCorrect: boolean
): number {
  let pL_given_obs = 0;

  if (isCorrect) {
    // Probability of knowing, given they got it correct
        // Posterior calculation for correct responses
    const numerator = currentMastery * (1 - P_S);
    const denominator = (currentMastery * (1 - P_S)) + ((1 - currentMastery) * P_G);
    pL_given_obs = numerator / denominator;
  } else {
    // Probability of knowing, given they got it incorrect
        // Posterior calculation for incorrect responses
    const numerator = currentMastery * P_S;
    const denominator = (currentMastery * P_S) + ((1 - currentMastery) * (1 - P_G));
    pL_given_obs = numerator / denominator;
  }

  // Factor in transition probability (probability of learning)
  const nextMastery = pL_given_obs + (1 - pL_given_obs) * P_T;
  
  // Bound between 0.01 and 0.99
  return Math.max(0.01, Math.min(0.99, nextMastery));
}

// Select a question adaptively based on the student's mastery levels
// It prioritizes categories with lower mastery scores
export function selectAdaptiveQuestion(
  mastery: StudentMastery,
  excludeIds: string[] = []
): QuizQuestion {
  // Sort categories by mastery score (ascending - lowest first)
  const categoriesOrdered = Object.entries(mastery)
    .sort((a, b) => a[1] - b[1])
    .map(entry => entry[0] as QuizQuestion['category']);

  // Find a question in the weakest category that is not excluded
  for (const category of categoriesOrdered) {
    const available = VIVA_QUESTIONS.filter(
      q => q.category === category && !excludeIds.includes(q.id)
    );
    if (available.length > 0) {
      // Pick a random one from available in this category
      const index = Math.floor(Math.random() * available.length);
      return available[index];
    }
  }

  // Fallback: pick any question not excluded
  const fallbackAvailable = VIVA_QUESTIONS.filter(q => !excludeIds.includes(q.id));
  if (fallbackAvailable.length > 0) {
    const index = Math.floor(Math.random() * fallbackAvailable.length);
    return fallbackAvailable[index];
  }

  // If all questions are exhausted, recycle and pick any
  const index = Math.floor(Math.random() * VIVA_QUESTIONS.length);
  return VIVA_QUESTIONS[index];
}
