--
-- PostgreSQL database dump
--

\restrict vj834h0Y7dXnTbftclxCgcu9W7wggo39bmFQxwGYFPEChb7v5wKhcCHZDHQ2cwY

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: nomnom
--

INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (1, 'Chicken Breast (cooked)', 165.00, 31.00, 0.00, 0.00, 3.60, '100', 'g', false, '2025-11-16 19:57:53.804158', '2025-11-16 19:57:53.804158');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (2, 'Salmon (cooked)', 206.00, 22.00, 0.00, 0.00, 13.00, '100', 'g', false, '2025-11-16 19:57:53.806362', '2025-11-16 19:57:53.806362');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (3, 'Ground Beef 85/15 (cooked)', 215.00, 26.00, 0.00, 0.00, 12.00, '100', 'g', false, '2025-11-16 19:57:53.806741', '2025-11-16 19:57:53.806741');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (4, 'Eggs (large)', 72.00, 6.00, 0.40, 0.00, 5.00, '1', 'egg', false, '2025-11-16 19:57:53.807038', '2025-11-16 19:57:53.807038');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (5, 'Greek Yogurt (plain, nonfat)', 59.00, 10.00, 3.60, 0.00, 0.40, '100', 'g', false, '2025-11-16 19:57:53.807265', '2025-11-16 19:57:53.807265');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (6, 'Tofu (firm)', 144.00, 17.00, 3.00, 2.00, 9.00, '100', 'g', false, '2025-11-16 19:57:53.807469', '2025-11-16 19:57:53.807469');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (7, 'Brown Rice (cooked)', 112.00, 2.60, 24.00, 1.80, 0.90, '100', 'g', false, '2025-11-16 19:57:53.807736', '2025-11-16 19:57:53.807736');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (8, 'White Rice (cooked)', 130.00, 2.70, 28.00, 0.40, 0.30, '100', 'g', false, '2025-11-16 19:57:53.807934', '2025-11-16 19:57:53.807934');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (9, 'Sweet Potato (baked)', 90.00, 2.00, 21.00, 3.30, 0.20, '100', 'g', false, '2025-11-16 19:57:53.808219', '2025-11-16 19:57:53.808219');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (10, 'Oatmeal (cooked)', 71.00, 2.50, 12.00, 1.70, 1.50, '100', 'g', false, '2025-11-16 19:57:53.808601', '2025-11-16 19:57:53.808601');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (11, 'Quinoa (cooked)', 120.00, 4.40, 21.00, 2.80, 1.90, '100', 'g', false, '2025-11-16 19:57:53.808932', '2025-11-16 19:57:53.808932');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (12, 'Whole Wheat Bread', 247.00, 13.00, 41.00, 7.00, 3.40, '100', 'g', false, '2025-11-16 19:57:53.809127', '2025-11-16 19:57:53.809127');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (13, 'Banana', 89.00, 1.10, 23.00, 2.60, 0.30, '1', 'medium', false, '2025-11-16 19:57:53.809356', '2025-11-16 19:57:53.809356');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (14, 'Apple', 52.00, 0.30, 14.00, 2.40, 0.20, '1', 'medium', false, '2025-11-16 19:57:53.809624', '2025-11-16 19:57:53.809624');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (15, 'Broccoli (cooked)', 35.00, 2.40, 7.00, 3.30, 0.40, '100', 'g', false, '2025-11-16 19:57:53.809835', '2025-11-16 19:57:53.809835');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (16, 'Spinach (raw)', 23.00, 2.90, 3.60, 2.20, 0.40, '100', 'g', false, '2025-11-16 19:57:53.810178', '2025-11-16 19:57:53.810178');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (17, 'Carrots (raw)', 41.00, 0.90, 10.00, 2.80, 0.20, '100', 'g', false, '2025-11-16 19:57:53.81053', '2025-11-16 19:57:53.81053');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (18, 'Bell Pepper (raw)', 31.00, 1.00, 6.00, 2.10, 0.30, '100', 'g', false, '2025-11-16 19:57:53.810769', '2025-11-16 19:57:53.810769');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (19, 'Kale (raw)', 35.00, 2.90, 4.40, 4.10, 1.50, '100', 'g', false, '2025-11-16 19:57:53.81095', '2025-11-16 19:57:53.81095');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (20, 'Avocado', 160.00, 2.00, 8.50, 6.70, 15.00, '100', 'g', false, '2025-11-16 19:57:53.811119', '2025-11-16 19:57:53.811119');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (21, 'Almonds', 579.00, 21.00, 22.00, 12.50, 50.00, '100', 'g', false, '2025-11-16 19:57:53.811333', '2025-11-16 19:57:53.811333');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (22, 'Olive Oil', 884.00, 0.00, 0.00, 0.00, 100.00, '100', 'ml', false, '2025-11-16 19:57:53.811547', '2025-11-16 19:57:53.811547');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (23, 'Peanut Butter', 588.00, 25.00, 20.00, 6.00, 50.00, '100', 'g', false, '2025-11-16 19:57:53.811718', '2025-11-16 19:57:53.811718');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (24, 'Cheddar Cheese', 403.00, 25.00, 1.30, 0.00, 33.00, '100', 'g', false, '2025-11-16 19:57:53.811964', '2025-11-16 19:57:53.811964');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (25, 'Whole Milk', 61.00, 3.20, 4.80, 0.00, 3.30, '100', 'ml', false, '2025-11-16 19:57:53.812134', '2025-11-16 19:57:53.812134');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (26, 'Skim Milk', 34.00, 3.40, 5.00, 0.00, 0.10, '100', 'ml', false, '2025-11-16 19:57:53.812298', '2025-11-16 19:57:53.812298');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (27, 'Whey Protein Powder', 400.00, 80.00, 8.00, 2.00, 8.00, '100', 'g', false, '2025-11-16 19:57:53.812457', '2025-11-16 19:57:53.812457');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (55, 'PB2 Peanut Butter Powder', 60.00, 8.00, 6.00, 2.00, 2.00, '16', NULL, true, '2025-12-06 15:27:39.034188', '2025-12-06 15:27:39.034188');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (56, 'Sardines in Olive Oil', 190.00, 21.00, 0.00, 0.00, 12.00, '87', NULL, true, '2026-01-01 16:37:27.319331', '2026-01-01 16:37:27.319331');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (57, 'Sardines in Water', 140.00, 18.00, 0.00, 0.00, 8.00, '85', NULL, true, '2026-01-01 16:38:07.62197', '2026-01-01 16:38:07.62197');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (58, 'Olives (Costco Spanish Queen - stuffed with Pimento)', 25.00, 0.00, 0.00, 0.00, 2.00, '2', NULL, true, '2026-01-01 16:39:15.984876', '2026-01-01 16:39:15.984876');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (59, 'Mayonnaise (Costco Avocado Oil Mayo)', 100.00, 0.00, 0.00, 0.00, 11.00, '14', NULL, true, '2026-01-01 16:41:31.379747', '2026-01-01 16:41:31.379747');
INSERT INTO public.foods (id, name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom, created_at, updated_at) VALUES (60, 'Five Cheese Tortellini (Costco)', 270.00, 13.00, 37.00, 3.00, 8.00, '1', NULL, true, '2026-01-01 22:34:09.933361', '2026-01-01 22:34:09.933361');


--
-- Data for Name: meals; Type: TABLE DATA; Schema: public; Owner: nomnom
--

INSERT INTO public.meals (id, name, description, is_custom, created_at, updated_at) VALUES (1, 'Banana and PB2', '1 medium banana and 1.5 servings of PB2 powder', true, '2025-12-06 15:29:23.947552', '2025-12-06 15:29:23.947552');
INSERT INTO public.meals (id, name, description, is_custom, created_at, updated_at) VALUES (2, 'Sardine Salad', 'Basically tuna salad made with 1 can sardines', true, '2026-01-01 16:46:32.991696', '2026-01-01 16:46:32.991696');


--
-- Data for Name: food_log; Type: TABLE DATA; Schema: public; Owner: nomnom
--

INSERT INTO public.food_log (id, log_date, log_time, food_id, meal_id, servings, calories, protein_grams, carbs_grams, net_carbs_grams, fiber_grams, fat_grams, notes, created_at, updated_at) VALUES (3, '2025-12-06', '08:29:44', NULL, 1, 1.00, 179.00, 13.10, 32.00, 26.40, 5.60, 3.30, NULL, '2025-12-06 15:29:44.995606', '2025-12-06 15:29:44.995606');
INSERT INTO public.food_log (id, log_date, log_time, food_id, meal_id, servings, calories, protein_grams, carbs_grams, net_carbs_grams, fiber_grams, fat_grams, notes, created_at, updated_at) VALUES (4, '2025-12-07', '10:37:09', NULL, 1, 1.00, 179.00, 13.10, 32.00, 26.40, 5.60, 3.30, NULL, '2025-12-07 17:37:09.436077', '2025-12-07 17:37:09.436077');
INSERT INTO public.food_log (id, log_date, log_time, food_id, meal_id, servings, calories, protein_grams, carbs_grams, net_carbs_grams, fiber_grams, fat_grams, notes, created_at, updated_at) VALUES (5, '2026-01-01', '09:46:54', NULL, 2, 1.00, 290.00, 21.00, 0.00, 0.00, 0.00, 23.00, NULL, '2026-01-01 16:46:54.197942', '2026-01-01 16:46:54.197942');
INSERT INTO public.food_log (id, log_date, log_time, food_id, meal_id, servings, calories, protein_grams, carbs_grams, net_carbs_grams, fiber_grams, fat_grams, notes, created_at, updated_at) VALUES (6, '2026-01-01', '15:34:34', 60, NULL, 3.00, 810.00, 39.00, 111.00, 102.00, 9.00, 24.00, NULL, '2026-01-01 22:34:34.536634', '2026-01-01 22:34:34.536634');


--
-- Data for Name: meal_foods; Type: TABLE DATA; Schema: public; Owner: nomnom
--

INSERT INTO public.meal_foods (id, meal_id, food_id, servings, created_at) VALUES (1, 1, 55, 1.50, '2025-12-06 15:29:23.947552');
INSERT INTO public.meal_foods (id, meal_id, food_id, servings, created_at) VALUES (2, 1, 13, 1.00, '2025-12-06 15:29:23.947552');
INSERT INTO public.meal_foods (id, meal_id, food_id, servings, created_at) VALUES (3, 2, 59, 1.00, '2026-01-01 16:46:32.991696');
INSERT INTO public.meal_foods (id, meal_id, food_id, servings, created_at) VALUES (4, 2, 56, 1.00, '2026-01-01 16:46:32.991696');


--
-- Name: food_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nomnom
--

SELECT pg_catalog.setval('public.food_log_id_seq', 6, true);


--
-- Name: foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nomnom
--

SELECT pg_catalog.setval('public.foods_id_seq', 60, true);


--
-- Name: meal_foods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nomnom
--

SELECT pg_catalog.setval('public.meal_foods_id_seq', 4, true);


--
-- Name: meals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nomnom
--

SELECT pg_catalog.setval('public.meals_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict vj834h0Y7dXnTbftclxCgcu9W7wggo39bmFQxwGYFPEChb7v5wKhcCHZDHQ2cwY

