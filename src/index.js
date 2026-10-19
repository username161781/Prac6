const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const path = require('path');
const schema = require('./schema');
const app = express();
const PORT = process.env.PORT || 1234;
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/graphql', graphqlHTTP({ schema, graphiql: true, customFormatErrorFn: error => ({ message: error.message }) }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => {
  console.log(`GraphQL Library запущен: http://localhost:${PORT}`);
  console.log(`GraphiQL: http://localhost:${PORT}/graphql`);
});
