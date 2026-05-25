import { labModules } from './lab-modules';
import { requestPresets } from './lab-testing-presets';

describe('lab testing presets', () => {
  it('provides at least one request preset for every existing lab module', () => {
    for (const module of labModules) {
      expect(requestPresets.some((preset) => preset.moduleId === module.id)).toBe(true);
    }
  });

  it('keeps preset paths local and classifies state-changing presets', () => {
    for (const preset of requestPresets) {
      expect(preset.path.startsWith('/')).toBe(true);
      expect(preset.path).not.toContain('://');
      expect(['read_only', 'state_changing']).toContain(preset.safety);
    }
  });
});
