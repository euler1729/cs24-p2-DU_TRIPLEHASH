import sqlite3

def print_database_table(table_name):
    try:
        conn = sqlite3.connect('sqlite.db')
        cursor = conn.cursor()

        # Execute a SELECT query to fetch all rows from the specified table
        cursor.execute(f"SELECT * FROM {table_name}")

        # Fetch all rows of the result
        rows = cursor.fetchall()

        # Print the column headers
        column_names = [description[0] for description in cursor.description]
        print("    ".join(column_names))

        # Print the retrieved data
        for row in rows:
            print("\t".join(str(col) for col in row))

        conn.close()

    except sqlite3.Error as e:
        print("Database error:", e)

# Call the function to print the contents of the "vehicle" table
print_database_table("vehicle")
