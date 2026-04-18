import React, { useState, useEffect, useMemo, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { mealsAPI, foodsAPI } from '../api';
import { Meal, Food, CreateMealRequest } from '../types';
import ConfirmModal from './ConfirmModal';
import MacroLabels from './MacroLabels';
import MacroMetrics from './MacroMetrics';
import { getMacroLabelsFromPercentages } from '../utils/macroLabels';
import './MealBuilder.css';

interface MealFormModalProps {
  meal: Meal | null;
  foods: Food[];
  onClose: () => void;
  onSuccess: () => void;
}

interface MealFormData {
  name: string;
  description: string;
}

interface SelectedFood {
  food_id: number;
  servings: number;
}

const MealBuilder: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [mealsRes, foodsRes] = await Promise.all([
        mealsAPI.getAll(),
        foodsAPI.getAll(),
      ]);
      setMeals(mealsRes.data);
      setFoods(foodsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await mealsAPI.delete(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError('Failed to delete meal.');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleEdit = (meal: Meal): void => {
    setEditingMeal(meal);
    setShowAddModal(true);
  };

  const foodsById = useMemo(
    () => new Map(foods.map((food) => [food.id, food])),
    [foods]
  );

  const getFoodLabelsById = (foodId: number) => {
    const food = foodsById.get(foodId);

    if (!food) {
      return [];
    }

    return getMacroLabelsFromPercentages({
      protein: food.protein_percentage,
      carbs: food.carbs_percentage,
      fat: food.fat_percentage,
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="meal-builder">
      <div className="card">
        <div className="card-header">
          <h2>Meal Builder</h2>
          <button 
            className="primary" 
            onClick={() => {
              setEditingMeal(null);
              setShowAddModal(true);
            }}
          >
            + Create Meal
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {meals.length === 0 ? (
          <p className="no-results">No meals created yet. Click "Create Meal" to get started!</p>
        ) : (
          <div className="meals-grid">
            {meals.map((meal: Meal) => (
              <div key={meal.id} className="meal-card">
                <div className="meal-header">
                  <h3>{meal.name}</h3>
                </div>

                <MacroLabels
                  labels={
                    meal.totals
                      ? getMacroLabelsFromPercentages({
                          protein: meal.totals.protein_percentage,
                          carbs: meal.totals.carbs_percentage,
                          fat: meal.totals.fat_percentage,
                        })
                      : []
                  }
                  className="meal-macro-labels"
                />
                
                {meal.description && (
                  <p className="meal-description">{meal.description}</p>
                )}

                <div className="meal-foods">
                  <h4>Ingredients:</h4>
                  <ul>
                    {meal.foods && meal.foods.map((food, index) => (
                      <li key={index}>
                          <div className="meal-ingredient-name">{food.servings}x {food.food_name}</div>
                          <MacroLabels
                            labels={getFoodLabelsById(food.food_id)}
                            className="meal-ingredient-labels"
                          />
                      </li>
                    ))}
                  </ul>
                </div>

                {meal.totals && (
                  <div className="meal-nutrition">
                    <div className="nutrition-summary">
                      <div className="nutrition-item">
                        <span className="label">Calories</span>
                        <span className="value">{parseFloat(meal.totals.calories.toString()).toFixed(0)}</span>
                      </div>
                    </div>

                    <MacroMetrics
                      containerClassName="meal-macros-grid"
                      itemClassName="meal-macro-card"
                      titleClassName="meal-macro-label"
                      valueClassName="meal-macro-value"
                      percentageClassName="meal-macro-percent"
                      showTitleBadges
                      metrics={[
                        {
                          key: 'protein',
                          title: 'Protein',
                          value: `${parseFloat(meal.totals.protein_grams.toString()).toFixed(1)}g`,
                          percentage: meal.totals.protein_percentage,
                          badgeClassName: 'protein-badge',
                        },
                        {
                          key: 'carbs',
                          title: 'Net Carbs',
                          value: `${parseFloat(meal.totals.net_carbs_grams.toString()).toFixed(1)}g`,
                          percentage: meal.totals.carbs_percentage,
                          badgeClassName: 'carb-badge',
                        },
                        {
                          key: 'fat',
                          title: 'Fat',
                          value: `${parseFloat(meal.totals.fat_grams.toString()).toFixed(1)}g`,
                          percentage: meal.totals.fat_percentage,
                          badgeClassName: 'fat-badge',
                        },
                      ]}
                    />

                    <div className="macro-bar">
                      <div 
                        className="protein" 
                        style={{ width: `${meal.totals.protein_percentage}%` }}
                        title={`Protein: ${meal.totals.protein_percentage}%`}
                      />
                      <div 
                        className="carbs" 
                        style={{ width: `${meal.totals.carbs_percentage}%` }}
                        title={`Carbs: ${meal.totals.carbs_percentage}%`}
                      />
                      <div 
                        className="fat" 
                        style={{ width: `${meal.totals.fat_percentage}%` }}
                        title={`Fat: ${meal.totals.fat_percentage}%`}
                      />
                    </div>
                  </div>
                )}

                <div className="meal-actions">
                  <button className="secondary" onClick={() => handleEdit(meal)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => setConfirmDeleteId(meal.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <MealFormModal
          meal={editingMeal}
          foods={foods}
          onClose={() => {
            setShowAddModal(false);
            setEditingMeal(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingMeal(null);
            loadData();
          }}
        />
      )}

      {confirmDeleteId !== null && (
        <ConfirmModal
          title="Delete Meal"
          message="Are you sure you want to delete this meal? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
};

const MealFormModal: React.FC<MealFormModalProps> = ({ meal, foods, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<MealFormData>({
    name: meal?.name || '',
    description: meal?.description || '',
  });
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>(
    meal?.foods?.map(f => ({ food_id: f.food_id, servings: f.servings })) || []
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFood = (foodId: number): void => {
    if (!selectedFoods.find((f: SelectedFood) => f.food_id === foodId)) {
      setSelectedFoods([...selectedFoods, { food_id: foodId, servings: 1 }]);
    }
  };

  const removeFood = (foodId: number): void => {
    setSelectedFoods(selectedFoods.filter((f: SelectedFood) => f.food_id !== foodId));
  };

  const updateServings = (foodId: number, servings: string): void => {
    setSelectedFoods(selectedFoods.map((f: SelectedFood) =>
      f.food_id === foodId ? { ...f, servings: parseFloat(servings) || 1 } : f
    ));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name || selectedFoods.length === 0) {
      setError('Please provide a meal name and add at least one food.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const data: CreateMealRequest = {
        name: formData.name,
        description: formData.description || undefined,
        foods: selectedFoods,
      };

      if (meal) {
        await mealsAPI.update(meal.id, data);
      } else {
        await mealsAPI.create(data);
      }

      onSuccess();
    } catch (err: unknown) {
      console.error('Error saving meal:', err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error
        : undefined;
      setError(message || 'Failed to save meal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFoods = foods.filter((food: Food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedFoods.find((sf: SelectedFood) => sf.food_id === food.id)
  );

  const foodsById = useMemo(
    () => new Map(foods.map((food) => [food.id, food])),
    [foods]
  );

  const getFoodById = (id: number): Food | undefined => foodsById.get(id);

  // Calculate meal totals
  const calculateMealTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalNetCarbs = 0;
    let totalFat = 0;

    selectedFoods.forEach((sf: SelectedFood) => {
      const food = getFoodById(sf.food_id);
      if (food) {
        totalCalories += food.calories * sf.servings;
        totalProtein += food.protein_grams * sf.servings;
        totalNetCarbs += (food.carbs_grams - food.fiber_grams) * sf.servings;
        totalFat += food.fat_grams * sf.servings;
      }
    });

    // Calculate percentages based on calories from each macro
    const proteinCals = totalProtein * 4;
    const carbsCals = totalNetCarbs * 4;
    const fatCals = totalFat * 9;
    const totalMacroCals = proteinCals + carbsCals + fatCals;

    const proteinPercentage = totalMacroCals > 0 ? Math.round((proteinCals / totalMacroCals) * 100) : 0;
    const carbsPercentage = totalMacroCals > 0 ? Math.round((carbsCals / totalMacroCals) * 100) : 0;
    const fatPercentage = totalMacroCals > 0 ? Math.round((fatCals / totalMacroCals) * 100) : 0;

    return {
      calories: totalCalories,
      protein: totalProtein,
      netCarbs: totalNetCarbs,
      fat: totalFat,
      proteinPercentage,
      carbsPercentage,
      fatPercentage,
    };
  };

  const mealTotals = calculateMealTotals();

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <div className="modal-header">
          <h2>{meal ? 'Edit Meal' : 'Create New Meal'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Meal Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Foods in This Meal</label>
            {selectedFoods.length === 0 ? (
              <p className="helper-text">No foods added yet. Search and add foods below.</p>
            ) : (
              <div className="selected-foods-list">
                {selectedFoods.map((sf: SelectedFood) => {
                  const food = getFoodById(sf.food_id);
                  if (!food) return null;
                  
                  // Calculate adjusted values for this food item based on servings
                  const adjustedCalories = (food.calories * sf.servings).toFixed(0);
                  const adjustedProtein = (food.protein_grams * sf.servings).toFixed(1);
                  const adjustedNetCarbs = ((food.carbs_grams - food.fiber_grams) * sf.servings).toFixed(1);
                  const adjustedFat = (food.fat_grams * sf.servings).toFixed(1);
                  
                  return (
                    <div key={sf.food_id} className="selected-food-item">
                      <div className="food-info">
                        <span className="food-name">{food.name}</span>
                        <MacroLabels
                          labels={getMacroLabelsFromPercentages({
                            protein: food.protein_percentage,
                            carbs: food.carbs_percentage,
                            fat: food.fat_percentage,
                          })}
                          className="food-macro-labels"
                        />
                        <span className="food-stats">
                          {food.serving_size} {food.serving_size ? '|' : ''} {adjustedCalories} cal | P: {adjustedProtein}g | C: {adjustedNetCarbs}g | F: {adjustedFat}g
                        </span>
                      </div>
                      <div className="food-controls">
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={sf.servings}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateServings(sf.food_id, e.target.value)}
                          className="servings-input"
                        />
                        <span className="servings-label">servings</span>
                        <button 
                          type="button" 
                          className="danger"
                          onClick={() => removeFood(sf.food_id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedFoods.length > 0 && (
            <div className="meal-totals-summary">
              <h3>Meal Totals</h3>
              <div className="totals-calories">
                <span className="label">Total Calories:</span>
                <span className="value">{mealTotals.calories.toFixed(0)}</span>
              </div>
              <MacroMetrics
                containerClassName="totals-macros"
                itemClassName="macro"
                titleClassName="macro-label"
                valueClassName="macro-value"
                percentageClassName="macro-percent"
                showTitleBadges
                metrics={[
                  {
                    key: 'protein',
                    title: 'Protein',
                    value: `${mealTotals.protein.toFixed(1)}g`,
                    percentage: mealTotals.proteinPercentage,
                    badgeClassName: 'protein-badge',
                  },
                  {
                    key: 'carbs',
                    title: 'Net Carbs',
                    value: `${mealTotals.netCarbs.toFixed(1)}g`,
                    percentage: mealTotals.carbsPercentage,
                    badgeClassName: 'carb-badge',
                  },
                  {
                    key: 'fat',
                    title: 'Fat',
                    value: `${mealTotals.fat.toFixed(1)}g`,
                    percentage: mealTotals.fatPercentage,
                    badgeClassName: 'fat-badge',
                  },
                ]}
              />
              <div className="macro-bar">
                <div 
                  className="protein" 
                  style={{ width: `${mealTotals.proteinPercentage}%` }}
                  title={`Protein: ${mealTotals.proteinPercentage}%`}
                />
                <div 
                  className="carbs" 
                  style={{ width: `${mealTotals.carbsPercentage}%` }}
                  title={`Carbs: ${mealTotals.carbsPercentage}%`}
                />
                <div 
                  className="fat" 
                  style={{ width: `${mealTotals.fatPercentage}%` }}
                  title={`Fat: ${mealTotals.fatPercentage}%`}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Add Foods</label>
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <div className="food-search-results">
              {filteredFoods.map((food: Food) => (
                <div key={food.id} className="food-search-item">
                  <div className="food-info">
                    <span className="food-name">{food.name}</span>
                    <MacroLabels
                      labels={getMacroLabelsFromPercentages({
                        protein: food.protein_percentage,
                        carbs: food.carbs_percentage,
                        fat: food.fat_percentage,
                      })}
                      className="food-macro-labels"
                    />
                    <span className="food-stats">
                      {food.calories} cal | P: {food.protein_grams}g | C: {(food.carbs_grams - food.fiber_grams).toFixed(1)}g | F: {food.fat_grams}g
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="primary"
                    onClick={() => addFood(food.id)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Saving...' : (meal ? 'Update Meal' : 'Create Meal')}
            </button>
            <button type="button" className="outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealBuilder;
