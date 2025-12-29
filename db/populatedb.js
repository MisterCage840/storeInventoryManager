require("dotenv").config()
const { Client } = require("pg")

const SQL = `
CREATE TABLE IF NOT EXISTS public.categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ingredients (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  qty NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit VARCHAR(10) NOT NULL,
  min_stock NUMERIC(10,2) NOT NULL DEFAULT 0,
  category_id INTEGER NOT NULL,

  CONSTRAINT fk_ingredients_category
    FOREIGN KEY (category_id)
    REFERENCES public.categories (id)
    ON DELETE RESTRICT
);

-- Ensure the seed rows cannot be duplicated
CREATE UNIQUE INDEX IF NOT EXISTS categories_seed_unique
  ON public.categories (name);

CREATE UNIQUE INDEX IF NOT EXISTS ingredients_unique_per_category
    ON public.ingredients (category_id, name);


INSERT INTO public.categories (name)
VALUES
  ('Vegetables'),
  ('Meat & Poultry'),
  ('Seafood'),
  ('Dairy'),
  ('Dry Goods'),
  ('Spices & Seasonings'),
  ('Oils & Sauces'),
  ('Beverages')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.ingredients (name, qty, unit, min_stock, category_id)
VALUES
-- Vegetables
('Tomatoes', 10, 'kg', 3, (SELECT id FROM categories WHERE name = 'Vegetables')),
('Onions', 8, 'kg', 3, (SELECT id FROM categories WHERE name = 'Vegetables')),
('Potatoes', 15, 'kg', 5, (SELECT id FROM categories WHERE name = 'Vegetables')),
('Bell Peppers', 4, 'kg', 2, (SELECT id FROM categories WHERE name = 'Vegetables')),
('Lettuce', 3, 'kg', 1, (SELECT id FROM categories WHERE name = 'Vegetables')),

-- Meat & Poultry
('Chicken Breast', 12, 'kg', 4, (SELECT id FROM categories WHERE name = 'Meat & Poultry')),
('Beef Mince', 6, 'kg', 3, (SELECT id FROM categories WHERE name = 'Meat & Poultry')),
('Lamb Chops', 5, 'kg', 2, (SELECT id FROM categories WHERE name = 'Meat & Poultry')),

-- Seafood
('Salmon Fillet', 4, 'kg', 2, (SELECT id FROM categories WHERE name = 'Seafood')),
('Shrimp', 3, 'kg', 1, (SELECT id FROM categories WHERE name = 'Seafood')),

-- Dairy
('Milk', 10, 'liters', 4, (SELECT id FROM categories WHERE name = 'Dairy')),
('Butter', 4, 'kg', 1, (SELECT id FROM categories WHERE name = 'Dairy')),
('Mozzarella Cheese', 5, 'kg', 2, (SELECT id FROM categories WHERE name = 'Dairy')),
('Yogurt', 6, 'kg', 2, (SELECT id FROM categories WHERE name = 'Dairy')),

-- Dry Goods
('Rice', 25, 'kg', 10, (SELECT id FROM categories WHERE name = 'Dry Goods')),
('Pasta', 12, 'kg', 5, (SELECT id FROM categories WHERE name = 'Dry Goods')),
('Flour', 20, 'kg', 8, (SELECT id FROM categories WHERE name = 'Dry Goods')),
('Sugar', 10, 'kg', 4, (SELECT id FROM categories WHERE name = 'Dry Goods')),

-- Spices & Seasonings
('Salt', 5, 'kg', 2, (SELECT id FROM categories WHERE name = 'Spices & Seasonings')),
('Black Pepper', 1, 'kg', 0.3, (SELECT id FROM categories WHERE name = 'Spices & Seasonings')),
('Paprika', 1, 'kg', 0.3, (SELECT id FROM categories WHERE name = 'Spices & Seasonings')),
('Cumin', 0.5, 'kg', 0.2, (SELECT id FROM categories WHERE name = 'Spices & Seasonings')),

-- Oils & Sauces
('Olive Oil', 6, 'liters', 2, (SELECT id FROM categories WHERE name = 'Oils & Sauces')),
('Vegetable Oil', 8, 'liters', 3, (SELECT id FROM categories WHERE name = 'Oils & Sauces')),
('Soy Sauce', 3, 'liters', 1, (SELECT id FROM categories WHERE name = 'Oils & Sauces')),
('Tomato Sauce', 5, 'liters', 2, (SELECT id FROM categories WHERE name = 'Oils & Sauces')),

-- Beverages
('Bottled Water', 50, 'pcs', 20, (SELECT id FROM categories WHERE name = 'Beverages')),
('Soft Drinks', 30, 'pcs', 15, (SELECT id FROM categories WHERE name = 'Beverages')),
('Fresh Juice', 10, 'liters', 4, (SELECT id FROM categories WHERE name = 'Beverages'))

ON CONFLICT (category_id, name) DO NOTHING;



`

async function main() {
  console.log("seeding...")
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  await client.query(SQL)
  await client.end()
  console.log("done")
}

main()
