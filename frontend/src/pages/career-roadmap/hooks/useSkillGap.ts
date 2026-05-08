import { useState, useEffect } from 'react';
import { companySkillMap, companyMetadata } from '../data/companySkillMap';

export interface CompanyMatch {
  name: string;
  matchScore: number;
  missingSkills: string[];
  visa: string;
  wfh: string;
}

export const useSkillGap = () => {
  const [matches, setMatches] = useState<CompanyMatch[]>([]);
  const [masteredNodes, setMasteredNodes] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('axe_mastered_nodes');
      const userSkills = stored ? JSON.parse(stored) : ['digital-foundation', 'verilog-hdl'];
      setMasteredNodes(userSkills);

      const calculatedMatches: CompanyMatch[] = Object.keys(companySkillMap).map((company) => {
        const requiredSkills = companySkillMap[company] || [];
        const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));
        const total = requiredSkills.length || 1; // Prevent division by zero
        const matchScore = Math.round(((requiredSkills.length - missingSkills.length) / total) * 100);
        
        return {
          name: company,
          matchScore,
          missingSkills,
          visa: companyMetadata[company]?.visa || 'Unknown',
          wfh: companyMetadata[company]?.wfh || 'Unknown',
        };
      });

      setMatches(calculatedMatches.sort((a, b) => b.matchScore - a.matchScore));
    } catch (e) {
      console.error("Skill Gap Calibration Failed:", e);
      setMatches([]);
    }
  }, []);

  return { matches, masteredNodes };
};
