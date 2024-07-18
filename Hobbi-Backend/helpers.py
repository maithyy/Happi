import json

from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore
cred = credentials.Certificate("./service-account.json")
app = firebase_admin.initialize_app(cred, name="helpers")
db = firestore.client(app=firebase_admin.get_app(name='helpers'))

load_dotenv()

def insert_exercise_data():
    print('Reading exercises.json')
    records = None
    with open('exercises.json', encoding="utf-8") as json_file:  
        records = json.load(json_file)
    print('%i records read from file' % len(records))

    i = 0
    batch = db.batch()
    print('Writing records to Firestore')
    for record in records:
        doc = db.collection('exercises').document(record['field1'])
        batch.set(doc, record)
        i += 1
        if (i % 500 == 0):
            batch.commit()
            batch = db.batch()
            print(i)
    batch.commit()
    print(i)