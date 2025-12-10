/**
 * Feature flag utilities for gating features based on environment variables
 */

/**
 * Check if AI Grader feature is enabled
 */
export function isAIGraderEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_OPEN_AI_GRADE;
  return flag === "true" || flag === "TRUE" || flag === "1";
}

/**
 * Check if AI Content Detector feature is enabled
 */
export function isAIContentDetectorEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_OPEN_AI_DETECTOR;
  return flag === "true" || flag === "TRUE" || flag === "1";
}

/**
 * Check if AI Similarity Checker feature is enabled
 */
export function isAISimilarityCheckerEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_OPEN_AI_SIMILARITY;
  return flag === "true" || flag === "TRUE" || flag === "1";
}

/**
 * Get feature status for all AI features
 */
export function getAIFeatureStatus() {
  return {
    grader: isAIGraderEnabled(),
    detector: isAIContentDetectorEnabled(),
    similarity: isAISimilarityCheckerEnabled(),
  };
}

