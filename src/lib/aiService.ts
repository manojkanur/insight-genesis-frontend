
import axios from 'axios'

const GROQ_API_KEY = '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'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export class GroqAIService {
  private apiKey: string
  
  constructor() {
    this.apiKey = GROQ_API_KEY
  }

  async generateSuggestions(title: string, industry: string): Promise<{
    context: string[]
    solutionOutline: string[]
  }> {
    try {
      const prompt = `As an expert whitepaper consultant, generate 3 unique context suggestions and 3 unique solution outline suggestions for a whitepaper titled "${title}" in the ${industry} industry.

Please provide your response in the following JSON format:
{
  "context": [
    "Context suggestion 1",
    "Context suggestion 2", 
    "Context suggestion 3"
  ],
  "solutionOutline": [
    "Solution outline suggestion 1",
    "Solution outline suggestion 2",
    "Solution outline suggestion 3"
  ]
}

Guidelines:
- Context suggestions should focus on industry challenges, market trends, and current situations
- Solution outline suggestions should provide actionable frameworks and methodologies
- Make each suggestion specific to the title and industry
- Keep suggestions professional and business-focused
- Each suggestion should be 1-2 sentences long`

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const aiResponse = response.data.choices[0].message.content
      const parsedResponse = JSON.parse(aiResponse)
      
      return {
        context: parsedResponse.context || [],
        solutionOutline: parsedResponse.solutionOutline || []
      }
    } catch (error) {
      console.error('Groq AI API Error:', error)
      
      // Fallback to mock suggestions if API fails
      return this.getFallbackSuggestions(title, industry)
    }
  }

  private getFallbackSuggestions(title: string, industry: string) {
    const contextSuggestions = [
      `Current market challenges in ${industry.toLowerCase()} industry regarding ${title.toLowerCase()}`,
      `Emerging trends and disruptions affecting ${title.toLowerCase()} in the ${industry.toLowerCase()} sector`,
      `Regulatory landscape and compliance requirements for ${title.toLowerCase()} implementation`
    ]
    
    const solutionSuggestions = [
      `Comprehensive framework for implementing ${title.toLowerCase()} in ${industry.toLowerCase()} organizations`,
      `Step-by-step methodology to address key challenges in ${title.toLowerCase()}`,
      `Best practices and proven strategies for successful ${title.toLowerCase()} adoption`
    ]
    
    return {
      context: contextSuggestions,
      solutionOutline: solutionSuggestions
    }
  }
}

export const groqAI = new GroqAIService()
