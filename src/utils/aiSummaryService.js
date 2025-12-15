import * as pdfjsLib from 'pdfjs-dist';

// PDF.js 워커 설정 - 로컬 public 폴더에서 로드
pdfjsLib.GlobalWorkerOptions.workerSrc = '/1201-project/pdf.worker.min.js';

// Hugging Face 무료 API (환경변수에서 로드)
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || '';
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

/**
 * PDF 파일에서 텍스트 추출
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const pageCount = Math.min(pdf.numPages, 10);
    
    console.log(`PDF 페이지 수: ${pdf.numPages}, 추출할 페이지: ${pageCount}`);
    
    for (let i = 1; i <= pageCount; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        for (const item of textContent.items) {
          if (item.str && item.str.trim()) {
            pageText += item.str + ' ';
          }
        }
        
        if (pageText.trim()) {
          fullText += pageText + '\n';
          console.log(`페이지 ${i} 추출 완료 (${pageText.length}자)`);
        }
      } catch (pageError) {
        console.warn(`페이지 ${i} 추출 실패:`, pageError);
        continue;
      }
    }
    
    if (!fullText.trim()) {
      throw new Error('PDF에서 텍스트를 추출할 수 없습니다. 이미지 기반 PDF일 수 있습니다.');
    }
    
    console.log(`총 추출 텍스트: ${fullText.length}자`);
    return fullText;
  } catch (error) {
    console.error('PDF 텍스트 추출 실패:', error);
    throw new Error('PDF 텍스트 추출 실패: ' + error.message);
  }
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