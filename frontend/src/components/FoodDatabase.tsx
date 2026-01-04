import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { foodsAPI } from '../api';
import { Food, CreateFoodRequest } from '../types';
import './FoodDatabase.css';

interface FoodFormModalProps {
  food: Food | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FoodFormData {
  name: string;
  calories: string | number;
  protein_grams: string | number;
  carbs_grams: string | number;
  fiber_grams: string | number;
  fat_grams: string | number;
  serving_size: string | number;
  serving_unit: string;
}

const FoodDatabase: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await foodsAPI.getAll();
      setFoods(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading foods:', err);
      setError('Failed to load foods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this food?')) {
      try {
        await foodsAPI.delete(id);
        await loadFoods();
      } catch (err) {
        console.error('Error deleting food:', err);
        alert('Failed to delete food.');
      }
    }
  };

  const handleEdit = (food: Food): void => {
    setEditingFood(food);
    setShowAddModal(true);
  };

  const filteredFoods = foods.filter((food: Food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="food-database">
      <div className="card">
        <div className="card-header">
          <h2>Food Database</h2>
          <button 
            className="primary" 
            onClick={() => {
              setEditingFood(null);
              setShowAddModal(true);
            }}
          >
            + Add Food
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="foods-grid">
          {filteredFoods.map((food: Food) => (
            <div key={food.id} className="food-card">
              <div className="food-header">
                <h3>{food.name}</h3>
                {food.is_custom && <span className="custom-badge">Custom</span>}
              </div>
              
              <div className="food-details">
                <div className="serving-info">
                  Serving Size: {food.serving_size} {food.serving_unit || 'g'}
                </div>
                
                <div className="nutrition-row">
                  <span className="label">Calories:</span>
                  <span className="value">{food.calories}</span>
                </div>
                
                <div className="macros-grid">
                  <div className="macro">
                    <div className="macro-label"><span className="protein-badge" style={{ marginRight: '5px' }}></span>Protein</div>
                    <div className="macro-value">{food.protein_grams}g</div>
                    <div className="macro-percent">{food.protein_percentage}%</div>
                  </div>
                  <div className="macro">
                    <div className="macro-label"><span className="carb-badge" style={{ marginRight: '5px' }}></span>Net Carbs</div>
                    <div className="macro-value">{(food.net_carbs_grams || 0).toFixed(1)}g</div>
                    <div className="macro-percent">{food.carbs_percentage}%</div>
                  </div>
                  <div className="macro">
                    <div className="macro-label"><span className="fat-badge" style={{ marginRight: '5px' }}></span>Fat</div>
                    <div className="macro-value">{food.fat_grams}g</div>
                    <div className="macro-percent">{food.fat_percentage}%</div>
                  </div>
                </div>

                <div className="macro-bar">
                  <div 
                    className="protein" 
                    style={{ width: `${food.protein_percentage}%` }}
                    title={`Protein: ${food.protein_percentage}%`}
                   />
                  <div 
                    className="carbs" 
                    style={{ width: `${food.carbs_percentage}%` }}
                    title={`Carbs: ${food.carbs_percentage}%`}
                  />
                  <div 
                    className="fat" 
                    style={{ width: `${food.fat_percentage}%` }}
                    title={`Fat: ${food.fat_percentage}%`}
                  />
                </div>
              </div>

              <div className="food-actions">
                <button className="secondary" onClick={() => handleEdit(food)}>
                  Edit
                </button>
                {food.is_custom && (
                  <button className="danger" onClick={() => handleDelete(food.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <p className="no-results">No foods found. Try adjusting your search or add a new food.</p>
        )}
      </div>

      {showAddModal && (
        <FoodFormModal
          food={editingFood}
          onClose={() => {
            setShowAddModal(false);
            setEditingFood(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingFood(null);
            loadFoods();
          }}
        />
      )}
    </div>
  );
};

const FoodFormModal: React.FC<FoodFormModalProps> = ({ food, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FoodFormData>({
    name: food?.name || '',
    calories: food?.calories || '',
    protein_grams: food?.protein_grams || '',
    carbs_grams: food?.carbs_grams || '',
    fiber_grams: food?.fiber_grams || 0,
    fat_grams: food?.fat_grams || '',
    serving_size: food?.serving_size || '',
    serving_unit: food?.serving_unit || 'g',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name || !formData.calories || !formData.protein_grams || !formData.carbs_grams || !formData.fat_grams) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const data: CreateFoodRequest = {
        name: formData.name,
        serving_size: formData.serving_size.toString(),
        serving_unit: formData.serving_unit,
        calories: parseFloat(formData.calories.toString()),
        protein_grams: parseFloat(formData.protein_grams.toString()),
        carbs_grams: parseFloat(formData.carbs_grams.toString()),
        fiber_grams: parseFloat(formData.fiber_grams.toString()) || 0,
        fat_grams: parseFloat(formData.fat_grams.toString()),
      };

      if (food) {
        await foodsAPI.update(food.id, data);
      } else {
        await foodsAPI.create(data);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving food:', err);
      setError(err.response?.data?.error || 'Failed to save food. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{food ? 'Edit Food' : 'Add New Food'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Serving Size *</label>
              <input
                type="number"
                name="serving_size"
                value={formData.serving_size}
                onChange={handleChange}
                step="0.1"
                required
              />
            </div>
            <div className="form-group">
              <label>Unit *</label>
              <select
                name="serving_unit"
                value={formData.serving_unit}
                onChange={handleChange}
                required
              >
                <option value="g">grams (g)</option>
                <option value="oz">ounces (oz)</option>
                <option value="cup">cup</option>
                <option value="tbsp">tablespoon</option>
                <option value="tsp">teaspoon</option>
                <option value="piece">piece</option>
                <option value="serving">serving</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Calories *</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              step="0.1"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Protein (g) *</label>
              <input
                type="number"
                name="protein_grams"
                value={formData.protein_grams}
                onChange={handleChange}
                step="0.1"
                required
              />
            </div>
            <div className="form-group">
              <label>Carbs (g) *</label>
              <input
                type="number"
                name="carbs_grams"
                value={formData.carbs_grams}
                onChange={handleChange}
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fiber (g)</label>
              <input
                type="number"
                name="fiber_grams"
                value={formData.fiber_grams}
                onChange={handleChange}
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Fat (g) *</label>
              <input
                type="number"
                name="fat_grams"
                value={formData.fat_grams}
                onChange={handleChange}
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Saving...' : (food ? 'Update Food' : 'Add Food')}
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

export default FoodDatabase;
