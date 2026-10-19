const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLList, GraphQLNonNull } = require('graphql');
const { books, authors } = require('./data');

let BookType;
const AuthorType = new GraphQLObjectType({
  name: 'Author', description: 'Автор одной или нескольких книг',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    birthYear: { type: GraphQLInt },
    books: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(BookType))), resolve: author => books.filter(book => book.authorId === author.id) }
  })
});
BookType = new GraphQLObjectType({
  name: 'Book', description: 'Книга в библиотечном каталоге',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    publishedYear: { type: GraphQLInt },
    available: { type: new GraphQLNonNull(GraphQLBoolean) },
    author: { type: new GraphQLNonNull(AuthorType), resolve: book => authors.find(author => author.id === book.authorId) }
  })
});
const QueryType = new GraphQLObjectType({ name: 'Query', fields: {
  books: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(BookType))), args: { genre: { type: GraphQLString }, search: { type: GraphQLString }, available: { type: GraphQLBoolean } }, resolve: (_, args) => {
    let result = [...books];
    if (args.genre) result = result.filter(b => b.genre.toLowerCase() === args.genre.toLowerCase());
    if (args.search) { const q = args.search.toLowerCase(); result = result.filter(b => b.name.toLowerCase().includes(q)); }
    if (typeof args.available === 'boolean') result = result.filter(b => b.available === args.available);
    return result;
  }},
  book: { type: BookType, args: { id: { type: new GraphQLNonNull(GraphQLID) } }, resolve: (_, { id }) => books.find(book => book.id === id) || null },
  authors: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AuthorType))), resolve: () => authors },
  author: { type: AuthorType, args: { id: { type: new GraphQLNonNull(GraphQLID) } }, resolve: (_, { id }) => authors.find(author => author.id === id) || null }
}});
const MutationType = new GraphQLObjectType({ name: 'Mutation', fields: {
  addBook: { type: new GraphQLNonNull(BookType), args: {
    id: { type: new GraphQLNonNull(GraphQLID) }, name: { type: new GraphQLNonNull(GraphQLString) }, genre: { type: new GraphQLNonNull(GraphQLString) }, authorId: { type: new GraphQLNonNull(GraphQLID) }, publishedYear: { type: GraphQLInt }
  }, resolve: (_, args) => {
    if (books.some(book => book.id === args.id)) throw new Error('Книга с таким id уже существует');
    const name = args.name.trim(), genre = args.genre.trim();
    if (!name || !genre) throw new Error('Название и жанр не должны быть пустыми');
    if (!authors.some(author => author.id === args.authorId)) throw new Error('Автор не найден');
    const book = { id: String(args.id), name, genre, authorId: String(args.authorId), publishedYear: args.publishedYear ?? null, available: true };
    books.push(book); return book;
  }},
  setBookAvailability: { type: BookType, args: { id: { type: new GraphQLNonNull(GraphQLID) }, available: { type: new GraphQLNonNull(GraphQLBoolean) } }, resolve: (_, { id, available }) => {
    const book = books.find(item => item.id === id); if (!book) throw new Error('Книга не найдена'); book.available = available; return book;
  }},
  addAuthor: { type: new GraphQLNonNull(AuthorType), args: { id: { type: new GraphQLNonNull(GraphQLID) }, name: { type: new GraphQLNonNull(GraphQLString) }, birthYear: { type: GraphQLInt } }, resolve: (_, args) => {
    if (authors.some(author => author.id === args.id)) throw new Error('Автор с таким id уже существует');
    const name = args.name.trim(); if (!name) throw new Error('Имя автора не должно быть пустым');
    const author = { id: String(args.id), name, birthYear: args.birthYear ?? null }; authors.push(author); return author;
  }}
}});
module.exports = new GraphQLSchema({ query: QueryType, mutation: MutationType });
