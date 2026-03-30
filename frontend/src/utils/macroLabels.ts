export type MacroLabel = 'high protein' | 'high fat' | 'low carb' | '40/40/20';

export interface MacroPercentages {
  protein: number;
  carbs: number;
  fat: number;
}

const BALANCED_TARGETS: MacroPercentages = {
  protein: 40,
  carbs: 20,
  fat: 40,
};

const BALANCED_TOLERANCE = 3;

const toPercentNumber = (value: number | string | undefined): number | null => {
  if (value === undefined) {
    return null;
  }

  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const withinTolerance = (actual: number, target: number, tolerance: number): boolean =>
  Math.abs(actual - target) <= tolerance;

export const getMacroLabelsFromPercentages = (
  percentages: {
    protein: number | string | undefined;
    carbs: number | string | undefined;
    fat: number | string | undefined;
  }
): MacroLabel[] => {
  const protein = toPercentNumber(percentages.protein);
  const carbs = toPercentNumber(percentages.carbs);
  const fat = toPercentNumber(percentages.fat);

  if (protein === null || carbs === null || fat === null) {
    return [];
  }

  const labels: MacroLabel[] = [];

  if (protein >= 40) {
    labels.push('high protein');
  }

  if (fat >= 40) {
    labels.push('high fat');
  }

  if (carbs <= 10) {
    labels.push('low carb');
  }

  if (
    withinTolerance(protein, BALANCED_TARGETS.protein, BALANCED_TOLERANCE) &&
    withinTolerance(fat, BALANCED_TARGETS.fat, BALANCED_TOLERANCE) &&
    withinTolerance(carbs, BALANCED_TARGETS.carbs, BALANCED_TOLERANCE)
  ) {
    labels.push('40/40/20');
  }

  return labels;
};

export const getMacroPercentagesFromGrams = (
  proteinGrams: number,
  carbsGrams: number,
  fatGrams: number
): MacroPercentages | null => {
  const proteinCalories = proteinGrams * 4;
  const carbsCalories = carbsGrams * 4;
  const fatCalories = fatGrams * 9;
  const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

  if (totalMacroCalories <= 0) {
    return null;
  }

  return {
    protein: (proteinCalories / totalMacroCalories) * 100,
    carbs: (carbsCalories / totalMacroCalories) * 100,
    fat: (fatCalories / totalMacroCalories) * 100,
  };
};

export const getMacroLabelsFromGrams = (
  proteinGrams: number,
  carbsGrams: number,
  fatGrams: number
): MacroLabel[] => {
  const percentages = getMacroPercentagesFromGrams(proteinGrams, carbsGrams, fatGrams);

  if (!percentages) {
    return [];
  }

  return getMacroLabelsFromPercentages(percentages);
};
