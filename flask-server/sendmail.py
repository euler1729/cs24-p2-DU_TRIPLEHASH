import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_otp(receiver_email, email_subject, email_message):
    with open('config.json', 'r') as f:
        config = json.load(f)
        sender = config['EMAIL']
        sender_key = config['MAIL_KEY']

    # Email content
    message = MIMEMultipart()
    message['From'] = sender
    message['To'] = receiver_email
    message['Subject'] = "OTP for Password Reset"
    message.attach(MIMEText(email_message, 'plain'))

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