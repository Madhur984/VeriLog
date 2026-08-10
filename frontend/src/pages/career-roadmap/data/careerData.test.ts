import { internships } from './internships';
import { SOURCES } from './careerData';

describe('career roadmap data integrity', () => {
  it('provides a valid official destination for every listed internship', () => {
    for (const internship of internships) {
      if (!internship.applicationUrl) throw new Error(`${internship.name} is missing an application URL`);
      expect(() => new URL(internship.applicationUrl)).not.toThrow();
      expect(internship.applicationUrl).not.toContain('#');
      expect(internship.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('keeps market sources as secure external URLs', () => {
    for (const source of SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(() => new URL(source.url)).not.toThrow();
    }
  });
});
