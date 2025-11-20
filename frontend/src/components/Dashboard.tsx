import React, { useState, useEffect, FormEvent } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { logsAPI, analyticsAPI, foodsAPI, mealsAPI } from '../api';
import { Food, Meal, FoodLog, DailySummary, WeeklySummary } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const weekStartStr = format(weekStart, 'yyyy-MM-dd');
      
      const [logsRes, dailyRes, weeklyRes] = await Promise.all([
        logsAPI.getAll({ date: dateStr }),
        analyticsAPI.getDailySummary(dateStr),
        analyticsAPI.getWeeklySummary(weekStartStr),
      ]);

      setLogs(logsRes.data);
      setDailySummary(dailyRes.data);
      setWeeklySummary(weeklyRes.data);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadFoodsAndMeals = async () => {
    try {
      const [foodsRes, mealsRes] = await Promise.all([
        foodsAPI.getAll(),
        mealsAPI.getAll(),
      ]);
      setFoods(foodsRes.data);
      setMeals(mealsRes.data);
    } catch (err) {
      console.error('Error loading foods and meals:', err);
    }
  };

  const handleAddLog = async (type: 'food' | 'meal', item: Food | Meal, servings: number) => {
    try {
      const logData: any = {
        log_date: format(currentDate, 'yyyy-MM-dd'),
        log_time: format(new Date(), 'HH:mm:ss'),
        servings: parseFloat(String(servings)) || 1,
      };

      if (type === 'food') {
        logData.food_id = item.id;
      } else {
        logData.meal_id = item.id;
      }

      await logsAPI.create(logData);
      await loadData();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding log:', err);
      alert('Failed to add entry. Please try again.');
    }
  };

  const handleDeleteLog = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await logsAPI.delete(id);
        await loadData();
      } catch (err) {
        console.error('Error deleting log:', err);
        alert('Failed to delete entry.');
      }
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="date-navigation">
        <button onClick={() => setCurrentDate(addDays(currentDate, -1))}>← Previous Day</button>
        <div className="current-date">
          <h2>{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
          <button className="secondary" onClick={() => setCurrentDate(new Date())}>
            Today
          </button>
        </div>
        <button onClick={() => setCurrentDate(addDays(currentDate, 1))}>Next Day →</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Weekly Summary Card */}
      <div className="card weekly-summary-card">
        <div className="card-header">
          <h3>Week Summary ({format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')})</h3>
        </div>
        {weeklySummary && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Weekly Calories</h3>
                <div className="value">{parseFloat(weeklySummary.total_calories).toFixed(0)}</div>
              </div>
              <div className="stat-card">
                <h3>Protein</h3>
                <div className="value">{parseFloat(weeklySummary.total_protein).toFixed(0)}g</div>
                <div className="label">{weeklySummary.protein_percentage}%</div>
              </div>
              <div className="stat-card">
                <h3>Net Carbs</h3>
                <div className="value">{parseFloat(weeklySummary.total_net_carbs).toFixed(0)}g</div>
                <div className="label">{weeklySummary.carbs_percentage}%</div>
              </div>
              <div className="stat-card">
                <h3>Fat</h3>
                <div className="value">{parseFloat(weeklySummary.total_fat).toFixed(0)}g</div>
                <div className="label">{weeklySummary.fat_percentage}%</div>
              </div>
            </div>
            <div className="macro-bar">
              <div 
                className="protein" 
                style={{ width: `${weeklySummary.protein_percentage}%` }}
                title={`Protein: ${weeklySummary.protein_percentage}%`}
              />
              <div 
                className="carbs" 
                style={{ width: `${weeklySummary.carbs_percentage}%` }}
                title={`Carbs: ${weeklySummary.carbs_percentage}%`}
              />
              <div 
                className="fat" 
                style={{ width: `${weeklySummary.fat_percentage}%` }}
                title={`Fat: ${weeklySummary.fat_percentage}%`}
              />
            </div>
          </>
        )}
      </div>

      {/* Daily Summary */}
      <div className="card">
        <div className="card-header">
          <h3>Daily Summary</h3>
        </div>
        {dailySummary && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Calories</h3>
                <div className="value">{parseFloat(dailySummary.total_calories).toFixed(0)}</div>
              </div>
              <div className="stat-card">
                <h3>Protein</h3>
                <div className="value">{parseFloat(dailySummary.total_protein).toFixed(0)}g</div>
                <div className="label">{dailySummary.protein_percentage}%</div>
              </div>
              <div className="stat-card">
                <h3>Net Carbs</h3>
                <div className="value">{parseFloat(dailySummary.total_net_carbs).toFixed(0)}g</div>
                <div className="label">{dailySummary.carbs_percentage}%</div>
              </div>
              <div className="stat-card">
                <h3>Fat</h3>
                <div className="value">{parseFloat(dailySummary.total_fat).toFixed(0)}g</div>
                <div className="label">{dailySummary.fat_percentage}%</div>
              </div>
            </div>
            <div className="macro-bar">
              <div 
                className="protein" 
                style={{ width: `${dailySummary.protein_percentage}%` }}
                title={`Protein: ${dailySummary.protein_percentage}%`}
              />
              <div 
                className="carbs" 
                style={{ width: `${dailySummary.carbs_percentage}%` }}
                title={`Carbs: ${dailySummary.carbs_percentage}%`}
              />
              <div 
                className="fat" 
                style={{ width: `${dailySummary.fat_percentage}%` }}
                title={`Fat: ${dailySummary.fat_percentage}%`}
              />
            </div>
          </>
        )}
      </div>

      {/* Food Log Entries */}
      <div className="card">
        <div className="card-header">
          <h3>Food Log</h3>
          <button 
            className="primary" 
            onClick={() => {
              setShowAddModal(true);
              loadFoodsAndMeals();
            }}
          >
            + Add Entry
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="no-entries">No entries for this day. Click "Add Entry" to get started!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Item</th>
                <th>Servings</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Net Carbs</th>
                <th>Fat</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.log_time.substring(0, 5)}</td>
                  <td>
                    {log.food_name || log.meal_name}
                    {log.meal_id && <span className="meal-badge">MEAL</span>}
                  </td>
                  <td>{log.servings}</td>
                  <td>{parseFloat(String(log.calories)).toFixed(0)}</td>
                  <td>{parseFloat(String(log.protein_grams)).toFixed(1)}g</td>
                  <td>{parseFloat(String(log.net_carbs_grams)).toFixed(1)}g</td>
                  <td>{parseFloat(String(log.fat_grams)).toFixed(1)}g</td>
                  <td>
                    <button 
                      className="danger" 
                      onClick={() => handleDeleteLog(log.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <AddEntryModal
          foods={filteredFoods}
          meals={filteredMeals}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAdd={handleAddLog}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

interface AddEntryModalProps {
  foods: Food[];
  meals: Meal[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: (type: 'food' | 'meal', item: Food | Meal, servings: number) => void;
  onClose: () => void;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ 
  foods, 
  meals, 
  searchTerm, 
  setSearchTerm, 
  onAdd, 
  onClose 
}) => {
  const [selectedType, setSelectedType] = useState<'food' | 'meal'>('food');
  const [selectedItem, setSelectedItem] = useState<Food | Meal | null>(null);
  const [servings, setServings] = useState<number>(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      onAdd(selectedType, selectedItem, servings);
    }
  };

  const items = selectedType === 'food' ? foods : meals;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Entry</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <div className="button-group">
              <button
                type="button"
                className={selectedType === 'food' ? 'primary' : 'outline'}
                onClick={() => {
                  setSelectedType('food');
                  setSelectedItem(null);
                }}
              >
                Food
              </button>
              <button
                type="button"
                className={selectedType === 'meal' ? 'primary' : 'outline'}
                onClick={() => {
                  setSelectedType('meal');
                  setSelectedItem(null);
                }}
              >
                Meal
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder={`Search ${selectedType}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Select {selectedType === 'food' ? 'Food' : 'Meal'}</label>
            <div className="items-list">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`item-option ${selectedItem?.id === item.id ? 'selected' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="item-name">{item.name}</div>
                  <div className="item-stats">
                    {selectedType === 'food' ? (
                      <>
                        {(item as Food).calories} cal | P: {(item as Food).protein_grams}g | C: {((item as Food).carbs_grams - (item as Food).fiber_grams).toFixed(1)}g | F: {(item as Food).fat_grams}g
                      </>
                    ) : (
                      (item as Meal).totals && (
                        <>
                          {parseFloat(String((item as Meal).totals!.calories)).toFixed(0)} cal | 
                          P: {parseFloat(String((item as Meal).totals!.protein_grams)).toFixed(0)}g | 
                          C: {parseFloat(String((item as Meal).totals!.net_carbs_grams)).toFixed(0)}g | 
                          F: {parseFloat(String((item as Meal).totals!.fat_grams)).toFixed(0)}g
                        </>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedItem && (
            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={servings}
                onChange={(e) => setServings(parseFloat(e.target.value))}
              />
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="primary" disabled={!selectedItem}>
              Add Entry
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

export default Dashboard;
