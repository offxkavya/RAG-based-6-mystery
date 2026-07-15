import { CHEMICAL_DATABASE } from './chemicalDb';

export interface ParseResult {
  action: 'add' | 'heat' | 'stir' | 'filter' | 'titrate' | 'unknown' | 'help' | 'clear';
  chemicals: string[]; // matched chemical IDs
  queryType: 'action' | 'question';
  confidence: number;
  clarificationNeeded?: string;
  originalText: string;
}

export function parseNaturalLanguageInput(text: string): ParseResult {
  const normalized = text.toLowerCase().trim();
  const result: ParseResult = {
    action: 'unknown',
    chemicals: [],
    queryType: 'question',
    confidence: 0,
    originalText: text
  };

  if (!normalized) {
    return result;
  }

  // 1. Determine Action keywords
  let action: ParseResult['action'] = 'unknown';
      // Match common chemical adding verbs
  if (/\b(add|mix|pour|combine|put|introduce|drop|shake)\b/.test(normalized)) {
    action = 'add';
  } else if (/\b(heat|boil|warm|burn|flame|temp)\b/.test(normalized)) {
    action = 'heat';
  } else if (/\b(stir|shake|agitate|spin)\b/.test(normalized)) {
    action = 'stir';
  } else if (/\b(filter|decant|separate|strain)\b/.test(normalized)) {
    action = 'filter';
  } else if (/\b(titrate|titration|endpoint|burette|neutralize)\b/.test(normalized)) {
    action = 'titrate';
  } else if (/\b(clear|reset|clean|empty|wash)\b/.test(normalized)) {
    action = 'clear';
  } else if (/\b(help|viva|guide|how to|menu|options)\b/.test(normalized)) {
    action = 'help';
  }

  result.action = action;

  // 2. Identify Chemicals from Database synonyms
  const matchedChemicals: string[] = [];
  
      // Iterate database to map synonyms
  for (const [chemId, chem] of Object.entries(CHEMICAL_DATABASE)) {
    for (const synonym of chem.synonyms) {
      // Avoid matching sub-words like 'i' in 'dilute' or matching single letters unless they are chemical formulas
            // Prevent partial substring matching for short keys
      const regexStr = synonym.length <= 2 
        ? `\\b${escapeRegExp(synonym)}\\b`
        : `\\b${escapeRegExp(synonym)}\\b|${escapeRegExp(synonym)}`;
        
            // Create regex with case-insensitive option
      const regex = new RegExp(regexStr, 'i');
      if (regex.test(normalized)) {
        matchedChemicals.push(chemId);
        break; // match one synonym per chemical is enough
      }
    }
  }

  // Filter unique matches
  result.chemicals = Array.from(new Set(matchedChemicals));

  // 3. Resolve Ambiguities (e.g. "sulfate" vs "sulfite" or "nitrate" vs "nitrite")
  if (normalized.includes('sulfate') && normalized.includes('sulfite')) {
    result.clarificationNeeded = 'Did you mean "sulfate" (SO4 2-) or "sulfite" (SO3 2-)? Both were detected.';
    result.confidence = 0.5;
    return result;
  }
  
  if (normalized.includes('nitrate') && normalized.includes('nitrite')) {
    result.clarificationNeeded = 'Did you mean "nitrate" (NO3 -) or "nitrite" (NO2 -)?';
    result.confidence = 0.5;
    return result;
  }

  // 4. Determine Query Type
  // If the user uses action verbs and lists chemicals, treat as action
  const hasActionVerb = action !== 'unknown' && action !== 'help';
  const hasChemicals = result.chemicals.length > 0;

  if (hasActionVerb || (hasChemicals && action === 'add')) {
    result.queryType = 'action';
    result.confidence = 0.9;
  } else if (hasChemicals && action === 'unknown') {
    // e.g. "what happens with lead nitrate" -> question
    result.queryType = 'question';
    result.confidence = 0.8;
  } else if (normalized.includes('why') || normalized.includes('what') || normalized.includes('how') || normalized.includes('explain') || normalized.includes('viva')) {
    result.queryType = 'question';
    result.confidence = 0.85;
  } else {
    // Fallback confidence
    result.confidence = hasActionVerb ? 0.7 : 0.3;
  }

  // Special cases:
  // "test for lead" or "lead test" -> add lead nitrate + dilute HCl
  if (normalized.includes('test for lead') || normalized.includes('lead test') || normalized.includes('lead analysis')) {
    result.action = 'add';
    result.chemicals = ['pb_no3_2', 'dil_hcl'];
    result.queryType = 'action';
    result.confidence = 0.95;
  }
  
  if (normalized.includes('test for copper') || normalized.includes('copper test')) {
    result.action = 'add';
    result.chemicals = ['cu_so4', 'nh4_oh'];
    result.queryType = 'action';
    result.confidence = 0.95;
  }

  if (normalized.includes('test for chloride') || normalized.includes('chloride test')) {
    result.action = 'add';
    result.chemicals = ['na_cl', 'ag_no3_aq'];
    result.queryType = 'action';
    result.confidence = 0.95;
  }

  return result;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
