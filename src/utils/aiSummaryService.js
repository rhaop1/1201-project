import * as pdfjsLib from 'pdfjs-dist';

// PDF.js 워커 설정 - 로컬 node_modules에서 로드
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).href;

// Hugging Face 무료 API (환경변수에서 로드)
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || '';
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

/**
 * PDF 파일에서 텍스트 추출
 */
export async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise;
        let fullText = '';
        const pageCount = Math.min(pdf.numPages, 10); // 최대 10페이지까지 추출
        
        for (let i = 1; i <= pageCount; i++) {
          try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map(item => (typeof item === 'object' && item.str ? item.str : ''))
              .join(' ');
            
            if (pageText.trim()) {
              fullText += pageText + '\n';
            }
          } catch (pageError) {
            console.warn(`페이지 ${i} 추출 실패:`, pageError);
            continue;
          }
        }
        
        if (!fullText.trim()) {
          reject(new Error('PDF에서 텍스트를 추출할 수 없습니다.'));
        } else {
          resolve(fullText);
        }
      } catch (error) {
        reject(new Error('PDF 텍스트 추출 실패: ' + error.message));
      }
    };
    
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Hugging Face API를 사용한 텍스트 요약
 */
export async function summarizeWithAI(text) {
  try {
    // 텍스트 길이 제한 (토큰 제한)
    const maxLength = 1024;
    const truncatedText = text.substring(0, maxLength);
    
    const response = await fetch(HF_API_URL, {
      headers: { Authorization: `Bearer ${HF_API_KEY}` },
      method: 'POST',
      body: JSON.stringify({ inputs: truncatedText }),
    });
    
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (Array.isArray(result) && result[0]?.summary_text) {
      return result[0].summary_text;
    }
    
    throw new Error('요약 생성 실패');
  } catch (error) {
    console.error('AI 요약 오류:', error);
    throw error;
  }
}

/**
 * 수동 규칙 기반 요약 (AI 실패 시 폴백)
 */
export function summarizeManually(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const importantKeywords = ['연구', '결과', '방법', '발견', '분석', '데이터', '이론'];
  
  const scoredSentences = sentences.map((sentence, idx) => {
    let score = importantKeywords.reduce((s, keyword) => 
      s + (sentence.toLowerCase().includes(keyword) ? 1 : 0), 0
    );
    score += 1 / (idx + 1); // 앞쪽 문장에 가중치
    return { sentence: sentence.trim(), score };
  });
  
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.sentence)
    .join(' ');
  
  return topSentences || '요약 생성 실패';
}

/**
 * 통합 요약 함수 (AI + 폴백)
 */
export async function summarizePaper(text) {
  try {
    // AI 요약 시도
    const aiSummary = await summarizeWithAI(text);
    return { summary: aiSummary, method: 'AI' };
  } catch (error) {
    console.warn('AI 요약 실패, 규칙 기반 요약 사용:', error);
    // 폴백: 규칙 기반 요약
    const manualSummary = summarizeManually(text);
    return { summary: manualSummary, method: 'Rule-based' };
  }
}