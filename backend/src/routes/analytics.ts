import express, { Request, Response } from 'express';
import db from '../db';
import { DailySummary, WeeklySummary, MacroTrend } from '../types';

const router = express.Router();

interface DailySummaryRaw {
  log_date: string;
  total_entries: string;
  total_calories: string;
  total_protein: string;
  total_net_carbs: string;
  total_fat: string;
}

interface WeeklySummaryRaw {
  week_start: string;
  week_end: string;
  total_entries: string;
  total_calories: string;
  total_protein: string;
  total_net_carbs: string;
  total_fat: string;
}

interface DailyBreakdownRaw {
  log_date: string;
  daily_calories: string;
  daily_protein: string;
  daily_net_carbs: string;
  daily_fat: string;
  daily_entries: string;
}

// Get daily summary
router.get('/daily/:date', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    
    const result = await db.query<DailySummaryRaw>(`
      SELECT 
        log_date,
        COUNT(*) as total_entries,
        SUM(calories) as total_calories,
        SUM(protein_grams) as total_protein,
        SUM(net_carbs_grams) as total_net_carbs,
        SUM(fat_grams) as total_fat
      FROM food_log
      WHERE log_date = $1
      GROUP BY log_date
    `, [date]);
    
    if (result.rows.length === 0) {
      res.json({
        date,
        total_entries: 0,
        total_calories: 0,
        total_protein: 0,
        total_net_carbs: 0,
        total_fat: 0,
        protein_percentage: '0',
        carbs_percentage: '0',
        fat_percentage: '0',
      });
      return;
    }
    
    const summary = result.rows[0];
    const totalCalories = parseFloat(summary.total_calories) || 0;
    
    res.json({
      ...summary,
      total_calories: parseFloat(summary.total_calories).toFixed(2),
      total_protein: parseFloat(summary.total_protein).toFixed(2),
      total_net_carbs: parseFloat(summary.total_net_carbs).toFixed(2),
      total_fat: parseFloat(summary.total_fat).toFixed(2),
      protein_percentage: totalCalories > 0 ? ((parseFloat(summary.total_protein) * 4) / totalCalories * 100).toFixed(1) : '0',
      carbs_percentage: totalCalories > 0 ? ((parseFloat(summary.total_net_carbs) * 4) / totalCalories * 100).toFixed(1) : '0',
      fat_percentage: totalCalories > 0 ? ((parseFloat(summary.total_fat) * 9) / totalCalories * 100).toFixed(1) : '0',
    });
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
});

// Get weekly summary
router.get('/weekly/:start_date', async (req: Request, res: Response): Promise<void> => {
  try {
    const { start_date } = req.params;
    
    // Calculate end date (start_date + 6 days)
    const result = await db.query<WeeklySummaryRaw>(`
      SELECT 
        DATE($1) as week_start,
        DATE($1) + INTERVAL '6 days' as week_end,
        COUNT(*) as total_entries,
        SUM(calories) as total_calories,
        SUM(protein_grams) as total_protein,
        SUM(net_carbs_grams) as total_net_carbs,
        SUM(fat_grams) as total_fat
      FROM food_log
      WHERE log_date >= $1 AND log_date <= DATE($1) + INTERVAL '6 days'
    `, [start_date]);
    
    const summary = result.rows[0];
    const totalCalories = parseFloat(summary.total_calories) || 0;
    
    // Get daily breakdown
    const dailyResult = await db.query<DailyBreakdownRaw>(`
      SELECT 
        log_date,
        SUM(calories) as daily_calories,
        SUM(protein_grams) as daily_protein,
        SUM(net_carbs_grams) as daily_net_carbs,
        SUM(fat_grams) as daily_fat
      FROM food_log
      WHERE log_date >= $1 AND log_date <= DATE($1) + INTERVAL '6 days'
      GROUP BY log_date
      ORDER BY log_date
    `, [start_date]);
    
    res.json({
      week_start: summary.week_start,
      week_end: summary.week_end,
      total_entries: summary.total_entries || 0,
      total_calories: parseFloat(summary.total_calories || '0').toFixed(2),
      total_protein: parseFloat(summary.total_protein || '0').toFixed(2),
      total_net_carbs: parseFloat(summary.total_net_carbs || '0').toFixed(2),
      total_fat: parseFloat(summary.total_fat || '0').toFixed(2),
      protein_percentage: totalCalories > 0 ? ((parseFloat(summary.total_protein) * 4) / totalCalories * 100).toFixed(1) : '0',
      carbs_percentage: totalCalories > 0 ? ((parseFloat(summary.total_net_carbs) * 4) / totalCalories * 100).toFixed(1) : '0',
      fat_percentage: totalCalories > 0 ? ((parseFloat(summary.total_fat) * 9) / totalCalories * 100).toFixed(1) : '0',
      daily_breakdown: dailyResult.rows.map(day => ({
        date: day.log_date,
        calories: parseFloat(day.daily_calories).toFixed(2),
        protein: parseFloat(day.daily_protein).toFixed(2),
        net_carbs: parseFloat(day.daily_net_carbs).toFixed(2),
        fat: parseFloat(day.daily_fat).toFixed(2),
      })),
    });
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
    res.status(500).json({ error: 'Failed to fetch weekly summary' });
  }
});

// Get date range summary for trends
router.get('/range/:start_date/:end_date', async (req: Request, res: Response): Promise<void> => {
  try {
    const { start_date, end_date } = req.params;
    
    const result = await db.query<DailyBreakdownRaw>(`
      SELECT 
        log_date,
        SUM(calories) as daily_calories,
        SUM(protein_grams) as daily_protein,
        SUM(net_carbs_grams) as daily_net_carbs,
        SUM(fat_grams) as daily_fat,
        COUNT(*) as daily_entries
      FROM food_log
      WHERE log_date >= $1 AND log_date <= $2
      GROUP BY log_date
      ORDER BY log_date
    `, [start_date, end_date]);
    
    const data = result.rows.map(day => {
      const dailyCalories = parseFloat(day.daily_calories) || 0;
      return {
        date: day.log_date,
        calories: parseFloat(day.daily_calories).toFixed(2),
        protein: parseFloat(day.daily_protein).toFixed(2),
        net_carbs: parseFloat(day.daily_net_carbs).toFixed(2),
        fat: parseFloat(day.daily_fat).toFixed(2),
        entries: day.daily_entries,
        protein_percentage: dailyCalories > 0 ? ((parseFloat(day.daily_protein) * 4) / dailyCalories * 100).toFixed(1) : '0',
        carbs_percentage: dailyCalories > 0 ? ((parseFloat(day.daily_net_carbs) * 4) / dailyCalories * 100).toFixed(1) : '0',
        fat_percentage: dailyCalories > 0 ? ((parseFloat(day.daily_fat) * 9) / dailyCalories * 100).toFixed(1) : '0',
      };
    });
    
    // Calculate overall summary
    const totals = data.reduce((acc, day) => ({
      total_calories: acc.total_calories + parseFloat(day.calories),
      total_protein: acc.total_protein + parseFloat(day.protein),
      total_net_carbs: acc.total_net_carbs + parseFloat(day.net_carbs),
      total_fat: acc.total_fat + parseFloat(day.fat),
      total_entries: acc.total_entries + Number(day.entries),
    }), { total_calories: 0, total_protein: 0, total_net_carbs: 0, total_fat: 0, total_entries: 0 });
    
    const avgCalories = data.length > 0 ? totals.total_calories / data.length : 0;
    
    res.json({
      start_date,
      end_date,
      days_count: data.length,
      totals: {
        calories: totals.total_calories.toFixed(2),
        protein: totals.total_protein.toFixed(2),
        net_carbs: totals.total_net_carbs.toFixed(2),
        fat: totals.total_fat.toFixed(2),
        entries: totals.total_entries,
      },
      averages: {
        calories: avgCalories.toFixed(2),
        protein: data.length > 0 ? (totals.total_protein / data.length).toFixed(2) : '0',
        net_carbs: data.length > 0 ? (totals.total_net_carbs / data.length).toFixed(2) : '0',
        fat: data.length > 0 ? (totals.total_fat / data.length).toFixed(2) : '0',
      },
      daily_data: data,
    });
  } catch (error) {
    console.error('Error fetching range summary:', error);
    res.status(500).json({ error: 'Failed to fetch range summary' });
  }
});

export default router;
