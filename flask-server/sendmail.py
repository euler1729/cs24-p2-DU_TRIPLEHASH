import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import random
import time
import sqlite3

def generate_otp():
    otp = ''.join(random.choices('0123456789', k=6))
    return otp

def send_otp(user_id, receiver_email):
    with open('config.json', 'r') as f:
        config = json.load(f)
        sender = config['EMAIL']
        sender_key = config['MAIL_KEY']

    # Email content
    message = MIMEMultipart()
    message['From'] = sender
    message['To'] = receiver_email
    message['Subject'] = "OTP for Password Reset"

    otp = generate_otp()
    expiration_time = int(time.time() * 1000) + (5 * 60 * 1000)  # 5 minutes in milliseconds

    conn = sqlite3.connect('sqlite.db')
    cursor = conn.cursor()
    
    # Check if the user ID already exists in the table
    cursor.execute("SELECT * FROM otp WHERE user_id = ?", (user_id,))
    existing_record = cursor.fetchone()
    
    expiration_time = int(time.time() * 1000) + (5 * 60 * 1000)  # 5 minutes in milliseconds
    otp = None

    if existing_record:
        # If user ID already exists, check if the OTP is still valid
        if existing_record[2] > int(time.time() * 1000):
            otp = existing_record[1]
        else:
            # If OTP has expired, generate a new OTP
            otp = generate_otp()
            cursor.execute("UPDATE otp SET otp = ?, exp = ? WHERE user_id = ?", (otp, expiration_time, user_id))
    else:
        # If user ID doesn't exist, insert new record
        otp = generate_otp()
        cursor.execute("INSERT INTO otp (user_id, otp, exp) VALUES (?, ?, ?)", (user_id, otp, expiration_time))

    # Commit the transaction
    conn.commit()
    # Close the connection
    conn.close()

    email_message = f"Your OTP is <b>{otp}</b>. This OTP will expire in 5 minutes."
    message.attach(MIMEText(email_message, 'html'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender, sender_key)
        text = message.as_string()
        server.sendmail(sender, receiver_email, text)
        server.quit()
        return True
    except Exception as e:
        print(e)
        return False