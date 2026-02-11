import mysql.connector

def test_db_connection():
    config = {
        'user': 'appuser',
        'password': 'apppassword',
        'host': 'localhost',
        'port': 3306,
        'database': 'shoppingmall'
    }

    try:
        print(f"Attempting to connect to {config['host']}:{config['port']} as {config['user']}...")
        conn = mysql.connector.connect(**config)
        print("Connection successful!")
        conn.close()
    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == "__main__":
    test_db_connection()
