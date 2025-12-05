import { createContext, useContext, useState, useEffect } from 'react';
import { books as initialBooks } from '../data/books';

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('books');
    return saved ? JSON.parse(saved) : initialBooks;
  });

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now(),
    };
    setBooks(prev => [...prev, newBook]);
    return newBook;
  };

  const updateBook = (id, updatedBook) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updatedBook } : book
    ));
  };

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const getBook = (id) => {
    return books.find(book => book.id === id);
  };

  return (
    <BooksContext.Provider value={{ books, addBook, updateBook, deleteBook, getBook }}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}
