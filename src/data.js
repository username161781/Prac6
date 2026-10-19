// Учебное хранилище в памяти процесса: после перезапуска данные сбрасываются.
const authors = [
  { id: 'a1', name: 'Фёдор Достоевский', birthYear: 1821 },
  { id: 'a2', name: 'Джейн Остин', birthYear: 1775 },
  { id: 'a3', name: 'Михаил Булгаков', birthYear: 1891 }
];
const books = [
  { id: 'b1', name: 'Преступление и наказание', genre: 'Роман', authorId: 'a1', publishedYear: 1866, available: true },
  { id: 'b2', name: 'Гордость и предубеждение', genre: 'Роман', authorId: 'a2', publishedYear: 1813, available: true },
  { id: 'b3', name: 'Мастер и Маргарита', genre: 'Роман', authorId: 'a3', publishedYear: 1967, available: false }
];
module.exports = { books, authors };
