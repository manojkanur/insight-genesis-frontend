
// Enhanced AI suggestion generator with unique content based on title
export interface SuggestionSet {
  context: string[]
  solutionOutline: string[]
}

// Industry-specific keywords and phrases
const industryKeywords = {
  technology: ['digital transformation', 'innovation', 'automation', 'AI/ML', 'cloud computing', 'cybersecurity'],
  healthcare: ['patient care', 'medical technology', 'telemedicine', 'healthcare analytics', 'compliance', 'digital health'],
  finance: ['fintech', 'regulatory compliance', 'risk management', 'digital banking', 'blockchain', 'financial analytics'],
  education: ['e-learning', 'educational technology', 'student engagement', 'curriculum development', 'online learning', 'assessment'],
  manufacturing: ['Industry 4.0', 'supply chain', 'quality control', 'automation', 'lean manufacturing', 'IoT'],
  retail: ['e-commerce', 'customer experience', 'inventory management', 'omnichannel', 'personalization', 'retail analytics'],
  'real estate': ['proptech', 'property management', 'market analysis', 'digital platforms', 'investment strategies', 'smart buildings'],
  energy: ['renewable energy', 'sustainability', 'smart grid', 'energy efficiency', 'carbon reduction', 'green technology'],
  transportation: ['logistics', 'fleet management', 'autonomous vehicles', 'supply chain optimization', 'mobility solutions', 'smart transportation'],
  agriculture: ['precision agriculture', 'crop monitoring', 'sustainable farming', 'agricultural technology', 'food security', 'agtech']
}

// Solution framework templates
const solutionFrameworks = [
  'comprehensive strategy framework',
  'step-by-step implementation methodology',
  'best practices and proven approaches',
  'technology-driven solution architecture',
  'risk mitigation and governance model',
  'performance measurement framework',
  'stakeholder engagement strategy',
  'change management approach',
  'scalable implementation roadmap',
  'cost-benefit analysis model'
]

// Context scenario templates
const contextScenarios = [
  'current market challenges and opportunities',
  'industry trends and disruptions',
  'regulatory landscape and compliance requirements',
  'technology adoption barriers and drivers',
  'competitive landscape analysis',
  'stakeholder needs and expectations',
  'operational efficiency gaps',
  'customer experience pain points',
  'risk factors and mitigation strategies',
  'emerging opportunities and threats'
]

// Generate hash from string for consistent randomization
function generateHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Seeded random function for consistent results based on input
function seededRandom(seed: number, min: number = 0, max: number = 1): number {
  const x = Math.sin(seed) * 10000
  const random = x - Math.floor(x)
  return min + random * (max - min)
}

// Extract key terms from title for contextual suggestions
function extractKeyTerms(title: string): string[] {
  const commonWords = ['the', 'of', 'in', 'to', 'for', 'and', 'or', 'but', 'a', 'an', 'is', 'are', 'was', 'were', 'how', 'what', 'why', 'when', 'where']
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 3)
}

export const generateUniqueSuggestions = (title: string, industry: string): SuggestionSet => {
  if (!title.trim() || !industry.trim()) {
    return { context: [], solutionOutline: [] }
  }

  const seed = generateHash(title + industry)
  const keyTerms = extractKeyTerms(title)
  const industryLower = industry.toLowerCase()
  const industryTerms = industryKeywords[industryLower as keyof typeof industryKeywords] || []
  
  // Generate context suggestions
  const contextSuggestions: string[] = []
  
  for (let i = 0; i < 3; i++) {
    const scenarioIndex = Math.floor(seededRandom(seed + i, 0, contextScenarios.length))
    const scenario = contextScenarios[scenarioIndex]
    
    // Incorporate key terms and industry-specific elements
    let suggestion = `Analyzing ${scenario} in the context of ${keyTerms.join(', ')} within the ${industry.toLowerCase()} sector`
    
    if (industryTerms.length > 0) {
      const termIndex = Math.floor(seededRandom(seed + i + 10, 0, industryTerms.length))
      suggestion += `, particularly focusing on ${industryTerms[termIndex]} implications`
    }
    
    contextSuggestions.push(suggestion)
  }
  
  // Generate solution outline suggestions
  const solutionSuggestions: string[] = []
  
  for (let i = 0; i < 3; i++) {
    const frameworkIndex = Math.floor(seededRandom(seed + i + 20, 0, solutionFrameworks.length))
    const framework = solutionFrameworks[frameworkIndex]
    
    let suggestion = `Developing a ${framework} for ${title.toLowerCase()}`
    
    if (keyTerms.length > 0) {
      const termIndex = i % keyTerms.length
      suggestion += `, with specific emphasis on ${keyTerms[termIndex]} optimization`
    }
    
    if (industryTerms.length > 0) {
      const termIndex = Math.floor(seededRandom(seed + i + 30, 0, industryTerms.length))
      suggestion += ` and ${industryTerms[termIndex]} integration`
    }
    
    solutionSuggestions.push(suggestion)
  }
  
  return {
    context: contextSuggestions,
    solutionOutline: solutionSuggestions
  }
}

// Additional utility for generating executive summary suggestions
export const generateExecutiveSuggestions = (title: string, industry: string): string[] => {
  const seed = generateHash(title + industry + 'executive')
  const keyTerms = extractKeyTerms(title)
  
  const executiveTemplates = [
    `Strategic imperative for ${industry.toLowerCase()} organizations to adopt`,
    `Market opportunity analysis for`,
    `Competitive advantage through implementation of`,
    `ROI justification and business case for`,
    `Risk assessment and mitigation strategies for`
  ]
  
  return executiveTemplates.map((template, i) => {
    const mainTerm = keyTerms[0] || title.split(' ')[0]
    return `${template} ${mainTerm.toLowerCase()} initiatives`
  }).slice(0, 3)
}
