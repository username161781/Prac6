async function graphql(query, variables = {}) {
  const response = await fetch('/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
  const payload = await response.json();
  if (payload.errors?.length) throw new Error(payload.errors.map(e => e.message).join('; '));
  return payload.data;
}
const statusEl = document.querySelector('#status'), booksEl = document.querySelector('#books');
function setStatus(text) { statusEl.textContent = text; }
function renderBooks(books) {
  booksEl.replaceChildren();
  if (!books.length) { const p=document.createElement('p'); p.className='muted'; p.textContent='Книги не найдены.'; booksEl.append(p); return; }
  for (const book of books) {
    const card=document.createElement('article'); card.className='book';
    const title=document.createElement('h3'); title.textContent=book.name;
    const author=document.createElement('p'); author.className='muted'; author.textContent=book.author?.name || 'Автор не указан';
    const details=document.createElement('p'); details.textContent=`${book.genre} · ${book.publishedYear ?? 'год неизвестен'}`;
    const pill=document.createElement('span'); pill.className='pill'; pill.textContent=book.available?'Доступна':'Выдана';
    const br=document.createElement('br'), button=document.createElement('button'); button.style.marginTop='12px'; button.textContent=book.available?'Отметить как выданную':'Вернуть в библиотеку';
    button.addEventListener('click',async()=>{try{await graphql('mutation ChangeAvailability($id: ID!, $available: Boolean!) { setBookAvailability(id:$id, available:$available) { id available } }',{id:book.id,available:!book.available});setStatus('Статус книги обновлён.');await loadBooks();}catch(e){setStatus(`Ошибка: ${e.message}`);}});
    card.append(title,author,details,pill,br,button); booksEl.append(card);
  }
}
async function loadBooks() {
  try {
    const search=document.querySelector('#search').value.trim(), genre=document.querySelector('#genre').value, availability=document.querySelector('#availability').value;
    const filters=[], declarations=[], variables={};
    if(search){filters.push('search: $search');declarations.push('$search: String');variables.search=search;}
    if(genre){filters.push('genre: $genre');declarations.push('$genre: String');variables.genre=genre;}
    if(availability!==''){filters.push('available: $available');declarations.push('$available: Boolean');variables.available=availability==='true';}
    const signature=declarations.length?`(${declarations.join(', ')})`:''; const args=filters.length?`(${filters.join(', ')})`:'';
    const data=await graphql(`query ${signature} { books${args} { id name genre publishedYear available author { id name } } }`,variables);
    renderBooks(data.books);setStatus(`Загружено книг: ${data.books.length}`);
  } catch(e) { setStatus(`Ошибка: ${e.message}`); }
}
document.querySelector('#refresh').addEventListener('click',loadBooks);
document.querySelector('#add-form').addEventListener('submit',async event=>{
  event.preventDefault();const yearText=document.querySelector('#book-year').value;
  const variables={id:document.querySelector('#book-id').value.trim(),name:document.querySelector('#book-name').value.trim(),genre:document.querySelector('#book-genre').value.trim(),authorId:document.querySelector('#book-author').value,publishedYear:yearText?Number(yearText):null};
  try{await graphql('mutation AddBook($id: ID!, $name: String!, $genre: String!, $authorId: ID!, $publishedYear: Int) { addBook(id:$id,name:$name,genre:$genre,authorId:$authorId,publishedYear:$publishedYear) { id name genre available author { name } } }',variables);event.target.reset();setStatus('Книга добавлена.');await loadBooks();}catch(e){setStatus(`Ошибка: ${e.message}`);}
});
loadBooks();
