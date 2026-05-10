from models import Book, Genre

books_db: dict[int, Book] = {
    1: Book(id=1, title="Cien años de soledad", author="Gabriel Garcia Marquez",
            year=1967, genre=Genre.fiction, pages=471),
    2: Book(id=2, title="1984", author="George Orwell",
            year=1949, genre=Genre.scifi, pages=328),
    3: Book(id=3, title="Sapiens", author="Yuval Noah Harari",
            year=2011, genre=Genre.nonfiction, pages=443),
    4: Book(id=4, title="El Hobbit", author="J.R.R. Tolkien",
            year=1937, genre=Genre.fantasy, pages=310),
    5: Book(id=5, title="Steve Jobs", author="Walter Isaacson",
            year=2011, genre=Genre.biography, pages=656),
}

next_id = 6


def get_next_id() -> int:
    global next_id
    val = next_id
    next_id += 1
    return val
