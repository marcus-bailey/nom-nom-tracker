# Technical Stack:
1. The app should be a web app which runs in docker.  I will let you work out the details, but a standard multi-tier web app, with a frontend, backend, and database.  But, use your discretion in the architecture design.
2. React for the frontent framework.
3. Node.js/Express, for the backend.
4. PostgreSQL for the database

# Core Features & Scope:
5. For food items, we can track them as individual food items, or as meals (combinations of food items).  So, the database should support both.
 - food item name or meal name
 - food item calories
 - food item macros (in grams and in percentage, both visible to the user)
    - carbs should always be tracked as net-carbs (total carbs minus fiber)
 - date and time
 - for each day, there should be a running total of calories, macro grams, and macro percentages
 - there should also be a running total for the entire week of calories, macro grams, and macro percentages
 - It would be nice, for the user to be able to view the weekly summary while they're entering meals/food for a particular day.  It could help them make food decisions that will keep them within their weekly goals.
6. Let's start with a single user app, and avoid all the authentication and authorization.
7. Yes, I would like a food database built-in.  And, users should have the ability to add foods.
  - Question - should we allow users to enter foods free form in the interface, and then we will add those to the database if they don't esist?
8. Yes, reporting/analytics would be great.  Daily and weekly summaries, as well as charts for longer range trends.
9. It does NOT need to work offline.

# Priority & Timeline:
10. A feature-complete app is more important than a quick MVP.
11. I have no design preferences.  I am happy with homegrown or a popular library.  I'll let you make the decision on this.