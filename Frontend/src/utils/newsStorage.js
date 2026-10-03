const STORAGE_KEY = "newsiq_news";

// GET ALL NEWS
export const getNews = () => {
  const news = localStorage.getItem(STORAGE_KEY);

  return news ? JSON.parse(news) : [];
};

// SAVE ALL NEWS
export const saveNews = (news) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
};

// ADD NEWS
export const addNews = (newsItem) => {
  const news = getNews();

  const updatedNews = [...news, newsItem];

  saveNews(updatedNews);
};

// UPDATE NEWS
export const updateNews = (id, updatedData) => {
  const news = getNews();

  const updatedNews = news.map((item) =>
    String(item.id) === String(id) ? { ...item, ...updatedData } : item,
  );

  saveNews(updatedNews);
};

// DELETE NEWS
export const deleteNews = (id) => {
  const news = getNews();

  const updatedNews = news.filter((item) => item.id !== id);

  saveNews(updatedNews);
};
