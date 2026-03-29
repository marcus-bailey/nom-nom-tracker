import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { logsAPI, analyticsAPI, foodsAPI, mealsAPI } from '../api';
import { Food, Meal, FoodLog, DailySummary, WeeklySummary, CreateLogRequest } from '../types';
import './Dashboard.css';
import ConfirmModal from './ConfirmModal';

const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const weekStartStr = format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');
      
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
  }, [currentDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      const logData: CreateLogRequest = {
        log_date: format(currentDate, 'yyyy-MM-dd'),
        log_time: format(new Date(), 'HH:mm:ss'),
        servings: parseFloat(String(servings)) || 1,
        ...(type === 'food' ? { food_id: item.id } : { meal_id: item.id }),
      };

      await logsAPI.create(logData);
      await loadData();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding log:', err);
      alert('Failed to add entry. Please try again.');
    }
  };

  const handleDeleteLog = async (id: number): Promise<void> => {
    try {
      await logsAPI.delete(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting log:', err);
      setError('Failed to delete entry.');
    } finally {
      setConfirmDeleteId(null);
    }
  };

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

      <div className="dashboard-columns">
        {/* Left Column: Daily Summary + Food Log */}
        <div className="dashboard-col-left">

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
                      onClick={() => setConfirmDeleteId(log.id)}
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

        </div>

        {/* Right Column: Weekly Summary */}
        <div className="dashboard-col-right">
          <div className="card weekly-summary-card">
            <div className="card-header">
              <h3>Weekly Averages ({format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')})</h3>
            </div>
            {weeklySummary && (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Avg Calories</h3>
                    <div className="value">{parseFloat(weeklySummary.avg_calories).toFixed(0)}</div>
                    <div className="label">{weeklySummary.day_count} day{weeklySummary.day_count !== 1 ? 's' : ''} logged</div>
                  </div>
                  <div className="stat-card">
                    <h3>Avg Protein</h3>
                    <div className="value">{parseFloat(weeklySummary.avg_protein).toFixed(0)}g</div>
                    <div className="label">{weeklySummary.protein_percentage}%</div>
                  </div>
                  <div className="stat-card">
                    <h3>Avg Net Carbs</h3>
                    <div className="value">{parseFloat(weeklySummary.avg_net_carbs).toFixed(0)}g</div>
                    <div className="label">{weeklySummary.carbs_percentage}%</div>
                  </div>
                  <div className="stat-card">
                    <h3>Avg Fat</h3>
                    <div className="value">{parseFloat(weeklySummary.avg_fat).toFixed(0)}g</div>
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
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <AddEntryModal
          foods={foods}
          meals={meals}
          onAdd={handleAddLog}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {confirmDeleteId !== null && (
        <ConfirmModal
          title="Delete Entry"
          message="Are you sure you want to delete this entry? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => handleDeleteLog(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
};

type CombinedEntry =
  | { type: 'food'; item: Food }
  | { type: 'meal'; item: Meal };

interface AddEntryModalProps {
  foods: Food[];
  meals: Meal[];
  onAdd: (type: 'food' | 'meal', item: Food | Meal, servings: number) => void;
  onClose: () => void;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ foods, meals, onAdd, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<CombinedEntry | null>(null);
  const [servings, setServings] = useState<number>(1);

  const allItems: CombinedEntry[] = [
    ...foods.map((item): CombinedEntry => ({ type: 'food', item })),
    ...meals.map((item): CombinedEntry => ({ type: 'meal', item })),
  ];

  const filteredItems = allItems.filter(entry =>
    entry.item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedEntry) {
      onAdd(selectedEntry.type, selectedEntry.item, servings);
    }
  };

  const isSelected = (entry: CombinedEntry) =>
    selectedEntry !== null &&
    selectedEntry.type === entry.type &&
    selectedEntry.item.id === entry.item.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Entry</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search foods and meals..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedEntry(null);
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Select Item</label>
            <div className="items-list">
              {filteredItems.map(entry => (
                <div
                  key={`${entry.type}-${entry.item.id}`}
                  className={`item-option ${isSelected(entry) ? 'selected' : ''}`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="item-option-header">
                    <div className="item-name">{entry.item.name}</div>
                    <span className={`item-type-badge item-type-badge--${entry.type}`}>
                      {entry.type === 'food' ? 'Food' : 'Meal'}
                    </span>
                  </div>
                  <div className="item-stats">
                    {entry.type === 'food' ? (
                      <>
                        {(entry.item as Food).calories} cal | P: {(entry.item as Food).protein_grams}g | C: {((entry.item as Food).carbs_grams - (entry.item as Food).fiber_grams).toFixed(1)}g | F: {(entry.item as Food).fat_grams}g
                      </>
                    ) : (
                      (entry.item as Meal).totals && (
                        <>
                          {parseFloat(String((entry.item as Meal).totals!.calories)).toFixed(0)} cal |
                          P: {parseFloat(String((entry.item as Meal).totals!.protein_grams)).toFixed(0)}g |
                          C: {parseFloat(String((entry.item as Meal).totals!.net_carbs_grams)).toFixed(0)}g |
                          F: {parseFloat(String((entry.item as Meal).totals!.fat_grams)).toFixed(0)}g
                        </>
                      )
                    )}
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p className="no-results">No items match your search.</p>
              )}
            </div>
          </div>

          {selectedEntry && (
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
            <button type="submit" className="primary" disabled={!selectedEntry}>
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
