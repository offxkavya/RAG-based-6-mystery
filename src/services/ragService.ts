export interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'salt_analysis' | 'titration' | 'kinetics' | 'electrochemistry' | 'colloids' | 'chromatography' | 'organic' | 'general';
  content: string;
  citations: string;
  keywords: string[];
}

export interface RagResponse {
  answer: string;
  citations: string[];
  suggestedQuestions: string[];
  retrievedDocs: { title: string; category: string }[];
}

const KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: 'pb_cation',
    title: 'Qualitative Analysis of Lead Cation (Pb2+)',
    category: 'salt_analysis',
    content: 'Lead belongs to Group I of cations. Reagent: dilute Hydrochloric Acid (HCl). Addition of dilute HCl to a solution containing lead ions yields a white precipitate of Lead Chloride (PbCl2). This precipitate is soluble in hot water but recrystallizes on cooling as white crystals. Confirmatory test: Adding Potassium Iodide (KI) to the lead solution yields a brilliant yellow precipitate of Lead Iodide (PbI2). If heated, this yellow precipitate dissolves, and upon cooling, it recrystallizes as shiny golden crystals called "golden spangles". Another test: Potassium Chromate (K2CrO4) yields a yellow precipitate of Lead Chromate (PbCrO4) which is insoluble in acetic acid.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Cation Analysis (Group I)',
    keywords: ['lead', 'pb', 'pb2+', 'golden spangles', 'ki', 'yellow ppt', 'lead nitrate', 'group 1', 'group i']
  },
  {
    id: 'cu_cation',
    title: 'Qualitative Analysis of Copper Cation (Cu2+)',
    category: 'salt_analysis',
    content: 'Copper belongs to Group II of cations. Reagent: Hydrogen Sulfide (H2S) gas in the presence of dilute HCl. In acidic medium, H2S precipitates copper as black Copper Sulfide (CuS). Confirmatory tests: 1) Sodium Hydroxide (NaOH) or dilute Ammonium Hydroxide (NH4OH) gives a pale blue precipitate of Copper Hydroxide [Cu(OH)2]. Adding excess NH4OH dissolves the precipitate, yielding a deep, intense blue solution of tetraamminecopper(II) complex [Cu(NH3)4]2+. 2) Potassium Ferrocyanide (K4[Fe(CN)6]) reacts with Cu2+ to give a highly characteristic chocolate-brown precipitate of Copper Ferrocyanide (Cu2[Fe(CN)6]).',
    citations: 'NCERT Class XII Chemistry Practical Manual - Cation Analysis (Group II)',
    keywords: ['copper', 'cu', 'cu2+', 'h2s', 'black ppt', 'chocolate brown', 'ferrocyanide', 'inky blue', 'deep blue', 'nh4oh']
  },
  {
    id: 'fe_cation',
    title: 'Qualitative Analysis of Ferric Iron Cation (Fe3+)',
    category: 'salt_analysis',
    content: 'Iron(III) belongs to Group III of cations. Reagent: Ammonium Hydroxide (NH4OH) in the presence of Ammonium Chloride (NH4Cl). Reagents must be added in this order to suppress hydroxide concentration via the common ion effect, preventing Group IV/V cations from precipitating. Adding NH4OH to Fe3+ gives a reddish-brown gelatinous precipitate of Iron(III) Hydroxide [Fe(OH)3]. Confirmatory tests: 1) Potassium Ferrocyanide (K4[Fe(CN)6]) yields a deep Prussian blue precipitate of Ferric Ferrocyanide [Fe4[Fe(CN)6]3]. 2) Potassium Thiocyanate (KSCN) gives an intense blood-red coloration due to the formation of the complex [Fe(SCN)]2+.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Cation Analysis (Group III)',
    keywords: ['iron', 'fe', 'fe3+', 'ferric', 'prussian blue', 'blood red', 'thiocyanate', 'kscn', 'gelatinous', 'reddish brown', 'nh4cl']
  },
  {
    id: 'al_cation',
    title: 'Qualitative Analysis of Aluminum Cation (Al3+)',
    category: 'salt_analysis',
    content: 'Aluminum belongs to Group III of cations. Reagent: Ammonium Hydroxide (NH4OH) in the presence of Ammonium Chloride (NH4Cl). It precipitates as a gelatinous white precipitate of Aluminum Hydroxide [Al(OH)3]. Confirmatory tests: 1) Sodium Hydroxide (NaOH) produces a white precipitate of Al(OH)3, which dissolves in excess NaOH to form sodium aluminate due to its amphoteric nature. 2) Lake Test: Al(OH)3 precipitate is formed in the presence of blue litmus solution. The gelatinous precipitate adsorbs the blue dye, forming a blue "lake" floating in a colorless liquid, confirming Al3+.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Cation Analysis (Group III)',
    keywords: ['aluminum', 'al', 'al3+', 'aluminium', 'lake test', 'blue lake', 'gelatinous white', 'al(oh)3', 'amphoteric', 'naoh']
  },
  {
    id: 'zn_cation',
    title: 'Qualitative Analysis of Zinc Cation (Zn2+)',
    category: 'salt_analysis',
    content: 'Zinc belongs to Group IV of cations. Reagent: H2S gas passed in alkaline medium (containing NH4Cl and NH4OH). Zinc precipitates as a dirty-white or grayish precipitate of Zinc Sulfide (ZnS). Confirmatory tests: 1) Adding NaOH dropwise yields a white precipitate of Zinc Hydroxide [Zn(OH)2] which is soluble in excess NaOH due to sodium zincate formation. 2) Potassium Ferrocyanide yields a white/greyish precipitate of zinc ferrocyanide.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Cation Analysis (Group IV)',
    keywords: ['zinc', 'zn', 'zn2+', 'zns', 'dirty white', 'zincate', 'group iv', 'group 4']
  },
  {
    id: 'ni_cation',
    title: 'Qualitative Analysis of Nickel Cation (Ni2+)',
    category: 'salt_analysis',
    content: 'Nickel belongs to Group IV of cations. Reagent: H2S gas passed in basic medium. Precipitates as black Nickel Sulfide (NiS). Confirmatory test: Adding Dimethylglyoxime (DMG) reagent to a nickel solution made basic with Ammonium Hydroxide (NH4OH) produces a highly specific, brilliant cherry-red precipitate of Nickel Dimethylglyoximate complex [Ni(dmg)2]. This is one of the most selective tests in qualitative analysis.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Cation Analysis (Group IV)',
    keywords: ['nickel', 'ni', 'ni2+', 'dmg', 'cherry red', 'dimethylglyoxime', 'nis', 'red ppt']
  },
  {
    id: 'nh4_cation',
    title: 'Qualitative Analysis of Ammonium Cation (NH4+)',
    category: 'salt_analysis',
    content: 'Ammonium represents Group Zero of cations. Reagent: Sodium Hydroxide (NaOH). Heating any solid ammonium salt with sodium hydroxide solution liberates gaseous Ammonia (NH3). NH3 gas is identified by its pungent odor, by turning moist red litmus paper blue (alkaline), and by producing dense white fumes of Ammonium Chloride (NH4Cl) when a glass rod dipped in concentrated HCl is held near the test tube mouth. Confirmatory test: Adding Nessler\'s Reagent (alkaline K2[HgI4]) to ammonium solution produces a reddish-brown precipitate or coloration (Iodide of Million\'s base).',
    citations: 'NCERT Class XII Chemistry Practical Manual - Cation Analysis (Group 0)',
    keywords: ['ammonium', 'nh4', 'nh4+', 'nessler', 'brown ppt', 'ammonia fumes', 'hcl fumes', 'pungent smell', 'nh3']
  },
  {
    id: 'carbonate_anion',
    title: 'Qualitative Analysis of Carbonate Anion (CO3^2-)',
    category: 'salt_analysis',
    content: 'Carbonate belongs to the dilute acid group of anions. Reagent: dilute Sulfuric Acid (H2SO4) or dilute HCl. Addition of dilute acid to a solid carbonate salt produces brisk effervescence due to the evolution of colorless, odorless Carbon Dioxide (CO2) gas. Confirmatory test: Passing the evolved CO2 gas through Lime Water (calcium hydroxide solution) turns the lime water milky due to the precipitation of insoluble Calcium Carbonate (CaCO3). If CO2 is passed in excess, the milkiness disappears due to the formation of soluble Calcium Bicarbonate [Ca(HCO3)2].',
    citations: 'NCERT Class XII Chemistry Practical Manual - Anion Analysis (Dilute Acid Group)',
    keywords: ['carbonate', 'co3', 'co32-', 'effervescence', 'lime water', 'milky', 'lime water milky', 'co2', 'dilute acid']
  },
  {
    id: 'sulfide_anion',
    title: 'Qualitative Analysis of Sulfide Anion (S2-)',
    category: 'salt_analysis',
    content: 'Sulfide belongs to the dilute acid group of anions. Reagent: dilute H2SO4. Adding dilute H2SO4 to a sulfide salt releases Hydrogen Sulfide (H2S) gas, which has a highly characteristic, obnoxious smell of rotten eggs. Confirmatory tests: 1) Evolved H2S gas turns a filter paper moistened with Lead Acetate solution shiny silvery-black due to the formation of Lead Sulfide (PbS). 2) Sodium Nitroprusside solution added to the aqueous salt solution gives a brilliant purple/violet coloration.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Anion Analysis (Dilute Acid Group)',
    keywords: ['sulfide', 's2-', 'rotten eggs', 'h2s', 'lead acetate paper', 'nitroprusside', 'purple color', 'black paper']
  },
  {
    id: 'halide_anions',
    title: 'Qualitative Analysis of Halide Anions (Cl-, Br-, I-)',
    category: 'salt_analysis',
    content: 'Chlorides, Bromides, and Iodides belong to the concentrated sulfuric acid group. Adding concentrated H2SO4: 1) Chloride: colorless fumes of HCl (pungent, white fumes with ammonia rod). 2) Bromide: reddish-brown vapors of Bromine (Br2). 3) Iodide: deep violet fumes of Iodine (I2) which turn starch paper blue. Confirmatory tests (Silver Nitrate Test): Acidify with dilute HNO3 and add Silver Nitrate (AgNO3). Chloride gives a curdy white precipitate (AgCl) which is soluble in NH4OH. Bromide gives a pale yellow precipitate (AgBr) sparingly soluble in NH4OH. Iodide gives a bright yellow precipitate (AgI) completely insoluble in NH4OH.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Anion Analysis (Conc. Acid Group)',
    keywords: ['chloride', 'bromide', 'iodide', 'cl-', 'br-', 'i-', 'agno3', 'silver nitrate', 'white ppt', 'yellow ppt', 'pale yellow', 'curdy white', 'violet fumes', 'red-brown vapors']
  },
  {
    id: 'nitrate_anion',
    title: 'Qualitative Analysis of Nitrate Anion (NO3-)',
    category: 'salt_analysis',
    content: 'Nitrate belongs to the concentrated sulfuric acid group. Adding concentrated H2SO4 and heating yields light brown fumes of NO2, which intensify upon adding copper turnings or paper pulp (reducing agents that convert nitrate to NO2). Confirmatory test (Brown Ring Test): Add freshly prepared, cold Ferrous Sulfate (FeSO4) solution to the salt solution. Then, slowly pour concentrated H2SO4 along the sides of the tilted test tube. A brown ring of Nitrosoferrous sulfate [Fe(H2O)5(NO)]2+ forms at the junction of the two liquid layers. Fresh FeSO4 must be used because Fe2+ easily oxidizes to Fe3+ in air, which cannot form the brown complex.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Anion Analysis (Conc. Acid Group)',
    keywords: ['nitrate', 'no3-', 'brown ring', 'feso4', 'copper turnings', 'conc h2so4', 'brown fumes', 'nitrosoferrous']
  },
  {
    id: 'redox_titration_theory',
    title: 'Redox Titration: KMnO4 vs Mohr\'s Salt / Oxalic Acid',
    category: 'titration',
    content: 'Potassium Permanganate (KMnO4) is a powerful oxidizing agent. In the presence of dilute H2SO4, MnO4- (purple, Mn VII) is reduced to Mn2+ (colorless, Mn II). KMnO4 acts as a self-indicator: the endpoint of the titration is indicated by the appearance of a permanent pale pink color. Mohr\'s salt is Double Ferrous Ammonium Sulfate. Fe2+ is oxidized to Fe3+ at room temperature. Oxalic acid (H2C2O4) is oxidized to CO2 gas. However, the reaction with oxalic acid is extremely slow at room temperature. Thus, the oxalic acid solution must be heated to 60-70°C before titrating to provide the activation energy needed to speed up the reaction. Nitric acid or hydrochloric acid cannot be used instead of H2SO4 because HCl is oxidized by KMnO4 to chlorine gas, and HNO3 is itself a strong oxidizer.',
    citations: 'NCERT Class XII Chemistry Textbook - Redox Volumetric Analysis',
    keywords: ['titration', 'kmno4', 'mohrs salt', 'oxalic acid', 'pale pink', 'self indicator', 'endpoint', 'heating 60', 'sulfuric acid', 'h2so4', 'redox']
  },
  {
    id: 'kinetics_demo',
    title: 'Chemical Kinetics & Iodine Clock Reaction',
    category: 'kinetics',
    content: 'Chemical kinetics study reaction rates. The rate increases with temperature (Arrhenius equation) and reactant concentration. In the starch-iodine clock reaction (Landolt reaction), lodate ions (IO3-) react with bisulfite (HSO3-) to generate iodide (I-). Once bisulfite is completely consumed, free iodine (I2) is rapidly produced, which complexes instantly with starch to produce a sudden, dramatic dark blue-black color. The time taken for this blue color to appear represents the reaction rate. Higher concentrations of iodate or higher temperatures speed up the reaction, causing the "clock" to trigger much faster.',
    citations: 'NCERT Class XII Chemistry Textbook - Chemical Kinetics Practicals',
    keywords: ['kinetics', 'rate of reaction', 'iodine clock', 'starch-iodine', 'blue black', 'concentration', 'temperature clock', 'landolt']
  },
  {
    id: 'colloids_preparation',
    title: 'Surface Chemistry: Lyophilic and Lyophobic Colloids',
    category: 'colloids',
    content: 'Colloids have particle sizes between 1-1000 nm. Lyophilic sols (liquid-loving) are stable and easily prepared by directly mixing the substance with the dispersion medium (e.g., starch sol, egg albumin sol, gelatin). Lyophobic sols (liquid-fearing) are unstable and require special methods. Ferric hydroxide sol is a lyophobic sol prepared by hydrolysis: adding ferric chloride solution dropwise to boiling distilled water yields a deep red ferric hydroxide sol. Starch sol is prepared by adding starch paste to boiling water with constant stirring. Egg albumin sol is prepared by mixing egg white with cold 5% NaCl solution. Acetic acid adsorption: Activated charcoal adsorbs acetic acid from solution, reducing its concentration. This is an example of solid-liquid adsorption described by the Freundlich Adsorption Isotherm.',
    citations: 'NCERT Class XII Chemistry Textbook - Surface Chemistry Practicals',
    keywords: ['colloid', 'sol', 'starch sol', 'egg albumin', 'adsorption', 'charcoal', 'acetic acid adsorption', 'lyophilic', 'lyophobic']
  },
  {
    id: 'organic_tests',
    title: 'Functional Groups: Carbohydrates, Proteins, Phenols',
    category: 'organic',
    content: 'Organic tests: 1) Carbohydrates: Molisch\'s test (alpha-naphthol + conc H2SO4) gives a violet ring at the junction. Reducing sugars (glucose, fructose) give a positive Fehling\'s or Benedict\'s test, forming a brick-red precipitate of cuprous oxide (Cu2O) upon heating. 2) Proteins: Biuret test (NaOH + CuSO4) gives a violet/purple complex. Xanthoproteic test (conc HNO3 + heat) gives a yellow color due to nitrated aromatic residues. 3) Phenols: React with neutral Ferric Chloride (FeCl3) to give a characteristic deep violet/purple soluble complex.',
    citations: 'NCERT Class XII Chemistry Practical Manual - Organic Chemistry',
    keywords: ['organic', 'carbohydrates', 'fehlings', 'biuret', 'protein', 'phenol', 'violet ring', 'fecl3 phenol', 'reducing sugar', 'glucose', 'benedicts']
  }
];

export function searchKnowledgeBase(query: string): RagResponse {
  const normalizedQuery = query.toLowerCase();
  const searchTerms = normalizedQuery.split(/\s+/).filter(t => t.length > 2);
  
  // Calculate score for each document
  const scoredDocs = KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    
    // Keyword match (high weight)
    // Match against each predefined keyword for scoring
    doc.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword)) {
        score += 15;
      }
    });

    // Title match
    if (doc.title.toLowerCase().includes(normalizedQuery)) {
      score += 30;
    }

    // Term match in content
    searchTerms.forEach(term => {
      if (doc.content.toLowerCase().includes(term)) {
        score += 2;
      }
      if (doc.title.toLowerCase().includes(term)) {
        score += 5;
      }
    });

    return { doc, score };
  });

  // Sort by score
  const results = scoredDocs
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.doc);

  // If no document matches, fallback to general chemistry answer
  if (results.length === 0) {
    return {
      answer: "I couldn't find a direct syllabus match for your query in the Class 12 practical manuals. Please make sure your question is related to salt analysis, redox titrations, kinetics, surface chemistry, chromatography, or organic functional group tests.",
      citations: ['Class 12 Chemistry Practical Guide'],
      suggestedQuestions: [
        'How do I test for Lead (Pb2+) ions?',
        'Why do we heat Oxalic acid in KMnO4 titration?',
        'What is the brown ring test for Nitrates?',
        'What is the cherry-red precipitate in nickel test?'
      ],
      retrievedDocs: []
    };
  }

  // Synthesize answer based on top matching document
  const primaryDoc = results[0];
  let responseText = primaryDoc.content;

  // Let's create smart contextual answers based on keywords
  if (normalizedQuery.includes('why') && normalizedQuery.includes('heat') && normalizedQuery.includes('oxalic')) {
    responseText = "We must heat the Oxalic acid solution to 60–70°C before titrating with Potassium Permanganate (KMnO4) because the reaction between oxalic acid and KMnO4 is extremely slow at room temperature due to a high activation energy. Heating supplies the necessary thermal energy to overcome this activation barrier. Once the reaction starts, the manganese(II) ions produced act as an autocalyst (autocatalysis), speeding up the reaction further. However, we do not boil it, as oxalic acid can decompose at boiling temperatures.";
  } else if (normalizedQuery.includes('brown ring') || (normalizedQuery.includes('test') && normalizedQuery.includes('nitrate'))) {
    responseText = "The Brown Ring Test is the confirmatory test for Nitrate ions (NO3-). In this test, a freshly prepared solution of Ferrous Sulfate (FeSO4) is added to the nitrate salt solution. Then, concentrated Sulfuric Acid (H2SO4) is poured slowly down the sides of the test tube. A brown ring of [Fe(H2O)5(NO)]SO4 (nitrosoferrous sulfate) forms at the junction of the acid and aqueous layers. It is critical to use freshly prepared FeSO4 because ferrous ions (Fe2+) oxidize rapidly in air to ferric ions (Fe3+), which do not form the brown complex.";
  } else if (normalizedQuery.includes('cherry-red') || normalizedQuery.includes('dmg') || (normalizedQuery.includes('test') && normalizedQuery.includes('nickel'))) {
    responseText = "Nickel(II) ions (Ni2+) are confirmed by adding Dimethylglyoxime (DMG) reagent to a nickel solution that has been made basic with Ammonium Hydroxide (NH4OH). This produces a highly specific, bright cherry-red precipitate of Nickel Dimethylglyoximate [Ni(dmg)2]. The reaction must be performed in basic conditions because the complexation releases protons (H+), and the base neutralizes them to shift the equilibrium towards precipitate formation.";
  } else if (normalizedQuery.includes('lake test') || (normalizedQuery.includes('test') && normalizedQuery.includes('aluminum'))) {
    responseText = "The Lake Test is used to confirm Aluminum ions (Al3+). When ammonium hydroxide is added to Al3+, Al(OH)3 precipitates as a gelatinous white solid. In the Lake Test, we perform this precipitation in the presence of blue litmus solution. The gelatinous aluminum hydroxide precipitate adsorbs the blue dye molecules onto its surface, resulting in a blue precipitate (the 'lake') suspended in a completely colorless liquid.";
  } else if (normalizedQuery.includes('lead') && normalizedQuery.includes('golden spangles')) {
    responseText = "The Golden Spangles test confirms Lead ions (Pb2+). Adding Potassium Iodide (KI) to a lead solution precipitates yellow Lead Iodide (PbI2). If you add water, heat the mixture to boiling, the precipitate dissolves because PbI2 is much more soluble in hot water. When the solution is allowed to cool slowly, Lead Iodide recrystallizes as beautiful, glittering golden-yellow hexagonal plates that look like sparkling spangles floating in the test tube.";
  }

  // Gather citations and suggestions
  const citations = Array.from(new Set(results.slice(0, 2).map(r => r.citations)));
  const retrievedDocs = results.slice(0, 3).map(r => ({ title: r.title, category: r.category }));

  // Generate recommendations
  const suggestedQuestionsMap: Record<string, string[]> = {
    salt_analysis: ['What is the group reagent for Group III?', 'How do I distinguish carbonate from sulfite?', 'What is Nessler\'s Reagent?'],
    titration: ['Why is sulfuric acid used in KMnO4 titrations?', 'What is the role of KMnO4 as a self-indicator?', 'How do I prepare standard Oxalic acid?'],
    organic: ['How does Fehling\'s test identify reducing sugars?', 'What is the difference between Biuret and Xanthoproteic tests?', 'How does phenol react with neutral FeCl3?'],
    kinetics: ['What is the Landolt Clock reaction?', 'How does temperature affect reaction rate?'],
    colloids: ['How is a ferric hydroxide sol prepared?', 'What is the difference between lyophilic and lyophobic sols?']
  };

  const primaryCategory = primaryDoc.category;
  const suggestedQuestions = suggestedQuestionsMap[primaryCategory] || [
    'How do I test for Lead (Pb2+) ions?',
    'Why do we heat Oxalic acid in KMnO4 titration?',
    'What is the brown ring test for Nitrates?'
  ];

  return {
    answer: responseText,
    citations,
    suggestedQuestions,
    retrievedDocs
  };
}

// Optional real LLM integration using external API key
export async function getLiveAiResponse(
  query: string, 
  history: { role: 'user' | 'assistant'; content: string }[],
  apiKey: string,
  provider: 'openai' | 'gemini' = 'openai'
): Promise<string> {
  const retrieval = searchKnowledgeBase(query);
  const systemPrompt = `You are a helpful Class 12 CBSE/ISC Chemistry Lab Assistant.
You must answer questions strictly in accordance with the Class 12 Practical Chemistry Syllabus.
Use the following retrieved context from official NCERT manuals to ground your response and prevent hallucination.
If the query is not related to Class 12 Practical Chemistry, politely redirect the student back to the lab syllabus.

CONTEXT:
${retrieval.answer}

Citations to include:
${retrieval.citations.join('\n')}

Guidelines:
- Explain chemical reactions step-by-step.
- Write balanced chemical equations.
- Include safety precautions.
- Keep the explanation simple, focused, and syllabus-accurate.`;

  try {
    if (provider === 'gemini') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...history.map(h => ({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: h.content }]
            })),
            { role: 'user', parts: [{ text: query }] }
          ]
        })
      });
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } else {
      // OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: query }
          ]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error("AI API call failed, falling back to local retrieval:", error);
    return `${retrieval.answer}\n\n*(Note: Live AI failed to connect. Displaying locally retrieved syllabus text)*`;
  }
}
