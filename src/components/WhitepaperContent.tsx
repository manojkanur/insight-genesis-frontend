
import { useEffect } from 'react'

interface WhitepaperContentProps {
  onContentLoad: (content: string) => void
}

export function WhitepaperContent({ onContentLoad }: WhitepaperContentProps) {
  const sampleWhitepaperContent = `
    <div style="max-width: 210mm; margin: 0 auto; padding: 20mm; font-family: 'Times New Roman', serif; line-height: 1.6; color: #333;">
      <!-- Title Page -->
      <div style="text-align: center; margin-bottom: 60px; page-break-after: always;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 40px 0 20px 0; color: #1a365d;">White Paper: Generative AI for Healthcare</h1>
        <p style="font-size: 16px; font-style: italic; margin: 20px 0; color: #4a5568;">(Conference/Workshop on Emerging Technologies in Healthcare)</p>
        
        <h2 style="font-size: 20px; margin: 30px 0; color: #2d3748;">Subtitle: Transforming Patient Care, Diagnostics, and Research with Generative AI</h2>
        <p style="font-size: 14px; margin: 20px 0; color: #718096;">Date: Insert Date</p>
      </div>

      <!-- Executive Summary -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 22px; font-weight: bold; color: #1a365d; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Executive Summary</h2>
        
        <p style="margin: 15px 0; text-align: justify;">Generative AI is revolutionizing the healthcare industry by enabling automated diagnostics, personalized treatment recommendations, drug discovery acceleration, and enhancing operational efficiency in hospitals. This white paper explores the current impact, opportunities, challenges, and ethical considerations of deploying generative AI in healthcare systems.</p>
        
        <h3 style="font-size: 16px; font-weight: bold; color: #2d3748; margin: 25px 0 10px 0;">Purpose and Scope:</h3>
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li>To highlight the role of generative AI in healthcare delivery and research.</li>
          <li>To analyze its benefits, risks, and limitations.</li>
          <li>To provide actionable recommendations for policymakers, practitioners, and technologists.</li>
        </ul>
        
        <h3 style="font-size: 16px; font-weight: bold; color: #2d3748; margin: 25px 0 10px 0;">Key Findings / Insights:</h3>
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li>Generative AI can improve diagnostics speed by up to 40% and reduce medical errors.</li>
          <li>AI-driven drug discovery pipelines shorten development cycles from years to months.</li>
          <li>Patient-specific treatment recommendations are increasing precision care.</li>
          <li>Ethical risks include bias in data, patient privacy, and over-reliance on automation.</li>
        </ul>
        
        <h3 style="font-size: 16px; font-weight: bold; color: #2d3748; margin: 25px 0 10px 0;">Major Recommendations:</h3>
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li>Implement AI-driven healthcare with regulatory guardrails.</li>
          <li>Promote secure use of patient data while ensuring transparency.</li>
          <li>Invest in clinical-AI partnerships to improve adoption.</li>
          <li>Establish national AI policy frameworks specific to health.</li>
        </ul>
      </div>

      <!-- Table of Contents -->
      <div style="margin-bottom: 40px; page-break-before: always;">
        <h2 style="font-size: 22px; font-weight: bold; color: #1a365d; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Table of Contents</h2>
        <ol style="margin: 20px 0 20px 30px; line-height: 2.0;">
          <li><strong>Introduction</strong></li>
          <li><strong>Session Insights</strong>
            <ol style="margin: 10px 0 10px 30px; list-style-type: decimal;">
              <li>Evolution of Generative AI in Healthcare</li>
              <li>Applications in Diagnostics, Drug Discovery, Personalized Care</li>
              <li>Expert Panel Contributions</li>
              <li>Challenges and Ethical Considerations</li>
            </ol>
          </li>
          <li><strong>Recommendations</strong></li>
          <li><strong>Conclusion</strong></li>
          <li><strong>Annexes</strong></li>
          <li><strong>References</strong></li>
        </ol>
      </div>

      <!-- Introduction -->
      <div style="margin-bottom: 40px; page-break-before: always;">
        <h2 style="font-size: 22px; font-weight: bold; color: #1a365d; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">1. Introduction</h2>
        
        <p style="margin: 15px 0; text-align: justify;">The intersection of artificial intelligence (AI) and healthcare marks one of the most critical inflection points in medical history. With the ability to generate meaningful predictions, reports, and even molecular structures, AI is reshaping the future of medicine.</p>
        
        <p style="margin: 15px 0; text-align: justify;"><strong>Background:</strong> AI in healthcare has progressed from simple rule-based systems to advanced generative architectures (e.g., GPT, MedPaLM).</p>
        
        <p style="margin: 15px 0; text-align: justify;"><strong>Context:</strong> By 2030, the global AI in healthcare market is expected to exceed $187 billion.</p>
      </div>

      <!-- Session Insights -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 22px; font-weight: bold; color: #1a365d; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">2. Session Insights / Findings / Analysis</h2>
        
        <h3 style="font-size: 18px; font-weight: bold; color: #2d3748; margin: 25px 0 10px 0;">2.1 Evolution of Generative AI in Healthcare</h3>
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li>From traditional machine learning to transformers & large language models (LLMs).</li>
          <li>Early adoption in radiology, pathology, and genomics.</li>
        </ul>
        
        <h3 style="font-size: 18px; font-weight: bold; color: #2d3748; margin: 25px 0 10px 0;">2.2 Applications</h3>
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li><strong>Diagnostics:</strong> AI scan interpretation for X-rays & MRIs.</li>
          <li><strong>Drug Discovery:</strong> Generative AI predicting protein structures & drug molecules (example: AlphaFold).</li>
          <li><strong>Personalized Care:</strong> Chatbots, clinical decision support, and tailored treatment plans.</li>
          <li><strong>Medical Documentation:</strong> Automating patient records and discharge summaries.</li>
        </ul>
        
        <h3 style="font-size: 18px; font-weight: bold; color: #2d3748; margin: 25px 0 10px 0;">2.3 Expert Contributions Sample</h3>
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li><strong>Dr. A. Meenakshi – Oncologist:</strong> "AI helps us see patterns invisible to the human eye within tumor imaging."</li>
          <li><strong>Dr. Rajesh Kumar – AI Researcher:</strong> "Generative AI is not replacing doctors, but augmenting their capabilities."</li>
        </ul>
        
        <h3 style="font-size: 18px; font-weight: bold; color: #2d3748; margin: 25px 0 10px 0;">2.4 Challenges & Ethical Concerns</h3>
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li><strong>Data Bias:</strong> Unequal datasets leading to inaccurate diagnoses.</li>
          <li><strong>Privacy & Security:</strong> Risks from sensitive patient data.</li>
          <li><strong>Over-reliance:</strong> "Black box" risks when doctors depend blindly on AI outcomes.</li>
          <li><strong>Regulatory Gaps:</strong> Lack of international AI-health standards.</li>
        </ul>
      </div>

      <!-- Recommendations -->
      <div style="margin-bottom: 40px; page-break-before: always;">
        <h2 style="font-size: 22px; font-weight: bold; color: #1a365d; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">3. Recommendations</h2>
        
        <p style="margin: 15px 0; text-align: justify;">Establish AI ethics committees within healthcare systems. Ensure data-sharing frameworks respect privacy laws (like GDPR/HIPAA).</p>
        
        <p style="margin: 15px 0; text-align: justify;"><strong>For Healthcare Providers:</strong> Train medical professionals in AI-literacy. Integrate AI tools with human oversight.</p>
        
        <p style="margin: 15px 0; text-align: justify;"><strong>For Technologists / Industry:</strong> Focus on explainable AI to build trust. Develop interoperable systems for hospitals worldwide.</p>
      </div>

      <!-- Conclusion -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 22px; font-weight: bold; color: #1a365d; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">4. Conclusion</h2>
        
        <p style="margin: 15px 0; text-align: justify;">Generative AI in healthcare represents a paradigm shift—not just in technology, but in how medicine itself is practiced. The coming decade will require collaborative work across clinicians, policymakers, and AI researchers to ensure safe, ethical, and impactful AI-driven healthcare.</p>
      </div>

      <!-- Annexes -->
      <div style="margin-bottom: 40px; page-break-before: always;">
        <h2 style="font-size: 22px; font-weight: bold; color: #1a365d; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">5. Annexes</h2>
        
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li>Speaker bios</li>
          <li>Sample conference agenda</li>
          <li>Technical diagrams (AI workflow in hospitals, patient data pipelines)</li>
          <li><strong>Acronyms:</strong> LLM (Large Language Model), EHR (Electronic Health Record), HIPAA (Health Insurance Portability and Accountability Act)</li>
        </ul>
      </div>

      <!-- References -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 22px; font-weight: bold; color: #1a365d; margin: 30px 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">6. References</h2>
        
        <ul style="margin: 10px 0 20px 30px; line-height: 1.8;">
          <li>Vaswani et al. 2017. Attention is All You Need.</li>
          <li>World Health Organization 2023. Ethics and Governance of AI in Healthcare.</li>
          <li>McKinsey & Company 2024. The Future of Generative AI in Life Sciences.</li>
        </ul>
      </div>
    </div>
  `

  useEffect(() => {
    onContentLoad(sampleWhitepaperContent)
  }, [onContentLoad])

  return null
}
