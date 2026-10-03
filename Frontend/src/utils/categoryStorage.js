const STORAGE_KEY = "newsiq_categories";

// GET ALL CATEGORIES
export const getCategories = () => {
  const categories = localStorage.getItem(STORAGE_KEY);

  return categories ? JSON.parse(categories) : [];
};

// SAVE ALL CATEGORIES
export const saveCategories = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

// ADD CATEGORY
export const addCategory = (category) => {
  const categories = getCategories();

  const updatedCategories = [...categories, category];

  saveCategories(updatedCategories);
};

// UPDATE CATEGORY
export const updateCategory = (id, updatedData) => {
  const categories = getCategories();

  const updatedCategories = categories.map((category) =>
    category.id === id ? { ...category, ...updatedData } : category,
  );

  saveCategories(updatedCategories);
};

// DELETE CATEGORY
export const deleteCategory = (id) => {
  const categories = getCategories();

  const updatedCategories = categories.filter((category) => category.id !== id);

  saveCategories(updatedCategories);
};
