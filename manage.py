#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SignMaster.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()



# import sqlite3

# # Connect to SQLite database
# conn = sqlite3.connect('db.sqlite3')
# cursor = conn.cursor()

# # Insert values into asl_signs table
# cursor.execute("""
#     INSERT INTO asl_signs (character, image_path) VALUES
#     ('A', 'static/images/A.png'), 
#     ('B', 'static/images/B.png'), 
#     ('C', 'static/images/C.png'),
#     ('D', 'static/images/D.png'),
#     ('E', 'static/images/E.png'),
#     ('F', 'static/images/F.png'),
#     ('G', 'static/images/G.png'),
#     ('H', 'static/images/H.png'),
#     ('I', 'static/images/I.png'),
#     ('J', 'static/images/J.png'),
#     ('K', 'static/images/K.png'),
#     ('L', 'static/images/L.png'),
#     ('M', 'static/images/M.png'),
#     ('N', 'static/images/N.png'),
#     ('O', 'static/images/O.png'),
#     ('P', 'static/images/P.png'),
#     ('Q', 'static/images/Q.png'),
#     ('R', 'static/images/R.png'),
#     ('S', 'static/images/S.png'),
#     ('T', 'static/images/T.png'),
#     ('U', 'static/images/U.png'),
#     ('V', 'static/images/V.png'),
#     ('W', 'static/images/W.png'),
#     ('X', 'static/images/X.png'),
#     ('Y', 'static/images/Y.png'),
#     ('Z', 'static/images/Z.png'),
#     ('0', 'static/images/0.png'),
#     ('1', 'static/images/1.png'),
#     ('2', 'static/images/2.png'),
#     ('3', 'static/images/3.png'),
#     ('4', 'static/images/4.png'),
#     ('5', 'static/images/5.png'),
#     ('6', 'static/images/6.png'),
#     ('7', 'static/images/7.png'),
#     ('8', 'static/images/8.png'),
#     ('9', 'static/images/9.png'),
#     (' ', 'static/images/space.png')  -- ✅ No trailing comma here!
# """)

# # Commit the changes
# conn.commit()

# # Close the connection
# conn.close()
