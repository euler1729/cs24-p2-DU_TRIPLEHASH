import sqlite3
from werkzeug.security import generate_password_hash

if __name__ == "__main__":
    db = sqlite3.connect("sqlite.db")
    with open("schema.sql", "r") as schema:
        db.executescript(schema.read())
    db.commit()
    db.close()
    hash = generate_password_hash('admin')
    conn = sqlite3.connect('sqlite.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO role (role_name) VALUES ('admin')")
    cursor.execute("INSERT INTO user (user_name, email, password, role_id) VALUES (?, ?, ?, ?)",
        ('admin', '2019-917-803@student.cse.du.ac.bd', hash, 1))
    conn.commit()
    conn.close()