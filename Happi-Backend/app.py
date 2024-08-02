from google.cloud import language_v2
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore
cred = credentials.Certificate("./Happi-Backend/service-account.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()

load_dotenv()

PROJECT_ID = "happi-415103"
assert PROJECT_ID
PARENT = f"projects/{PROJECT_ID}"
SENTIMENT_SCORE_CLIENT = language_v2.LanguageServiceClient()

#flask setup
app = Flask(__name__)
CORS(app)

#routes
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_id = data['user_id']
    email = data['email']
    first_name = data['first_name']
    last_name = data['last_name']
    
    data = {
        "user_id": user_id,
        "first": first_name,
        "last": last_name,
        "email": email,
        "preferences_set": False,
        "exercise_info": {
            "exercise_goal": 0,
            "skill": "",
            "equipment": []
        },
        "sleep_info": {
            "sleep_goal": 0,
            "wakeup_time": 0
        },
        "journal_info": {
            "happiness_score": 0,
            "journal_entry": "",
            "date": ""
        }
    }
    
    db.collection("users").document(user_id).set(data)
    
    return jsonify({'success': True, 'data':{'user_id': user_id}})

@app.route('/signup/preferences', methods=['POST'])
def preferences():
    data = request.json
    user_id = data['user_id']
    exercise_goal = data['exercise_goal']
    skill = data['skill']
    equipment = data['equipment']
    sleep_goal = data['sleep_goal']
    wakeup_time = data['wakeup_time']
    
    data_to_update = {
        "preferences_set": True,
        "exercise_info": {
            "exercise_goal": exercise_goal,
            "skill": skill,
            "equipment": equipment
        },
        "sleep_info": {
            "sleep_goal": sleep_goal,
            "wakeup_time": wakeup_time
        }
    }
    
    db.collection("users").document(user_id).update(data_to_update)
    
    return jsonify({'success': True, 'data':{'user_id': user_id}})

@app.route('/login', methods=['GET'])
def login():
    query = request.args.to_dict()
    email = query['emails']
    
    user_query = db.collection("users").where("email", "==", email).limit(1).get()

    if not user_query:
        return jsonify({'success': False})
    else:
        user_id = user_query[0].id
        return jsonify({'success': True, 'data':{'user_id': user_id}})
    
@app.route('/data', methods=['GET'])
def get_user_data():
    query = request.args.to_dict()
    user_id = query['user_id']
    
    user_query = db.collection("users").where("user_id", "==", user_id).limit(1).get()
    
    if not user_query:
        return jsonify({'success': False})
    else:
        user_data = user_query[0].to_dict()
        return jsonify({'success': True, 'data': user_data})
    
@app.route('/preferences', methods=['GET'])
def get_preferences_status():
    query = request.args.to_dict()
    user_id = query['user_id']
    
    user_query = db.collection("users").where("user_id", "==", user_id).limit(1).get()
    
    if not user_query:
        return jsonify({'success': False})
    else:
        preferences_set = user_query[0].to_dict()['preferences_set']
        return jsonify({'success': True, 'data': preferences_set})
    
@app.route('/journal', methods=['POST'])
def journal():
    data = request.json
    user_id = data['user_id']
    text_content = data['entry']
    date = data['date']
    
    document_type_in_plain_text = language_v2.Document.Type.PLAIN_TEXT
    
    language_code = "en"
    document = {
        "content": text_content,
        "type_": document_type_in_plain_text,
        "language_code": language_code,
    }

    encoding_type = language_v2.EncodingType.UTF8

    response = SENTIMENT_SCORE_CLIENT.analyze_sentiment(
        request={"document": document, "encoding_type": encoding_type}
    )
    
    score = response.document_sentiment.score
    
    data_to_update = {
        "journal_info": {
            "happiness_score": score,
            "journal_entry": text_content,
            "date": date
        }
    }
    
    db.collection("users").document(user_id).update(data_to_update)
    
    return jsonify({'success': True, 'data':{'score': score}})

@app.route('/entry', methods=['GET'])
def entry():
    query = request.args.to_dict()
    user_id = query['user_id']
    date = query['date']
    
    user_query = db.collection("users").where("user_id", "==", user_id).limit(1).get()
    
    if not user_query:
        return jsonify({'success': False})
    
    journal_entry = user_query[0].to_dict().get("journal_info", {}).get('journal_entry')
    entry_date = user_query[0].to_dict().get("journal_info", {}).get('date')
    score = user_query[0].to_dict().get("journal_info", {}).get('happiness_score')
    
    if date == entry_date:
        return jsonify({'success': True, 'data':{'entry': journal_entry, 'date': entry_date, 'score': score}})
    else:
        return jsonify({'success': False})

@app.route('/fitness', methods=['GET', 'POST'])
def fitness():
    data = request.json
    user_id = data['user_id']
    body_part = data['body_part']
    # exercise_type = data['exercise_type']
    
    user_query = db.collection("users").where("user_id", "==", user_id).limit(1).get()
    
    if not user_query:
        return jsonify({'success': False})
    
    skill = user_query[0].to_dict().get("exercise_info", {}).get('skill')
    equipment = user_query[0].to_dict().get("exercise_info", {}).get('equipment')
    
    # .where("Type", "==", exercise_type)
    user_query = db.collection("exercises").where("BodyPart", "==", body_part).where("Level", "==", skill).where("Equipment", "in", equipment).limit(20).get()
    
    if not user_query:
        return jsonify({'success': False})
    
    exercise_data = []
    for doc in user_query:
        exercise_data.append(doc.to_dict())
        
    return jsonify({'success': True, 'exercises': exercise_data})

@app.route('/sleep', methods=['GET'])
def sleep():
    query = request.args.to_dict()
    user_id = query['user_id']
    user_query = db.collection("users").where("user_id", "==", user_id).limit(1).get()
    
    if not user_query:
        return jsonify({'success': False})
    
    awakeTime = user_query[0].to_dict().get("sleep_info", {}).get('wakeup_time')
    wakeUpTimes = []
    track = 2
    for x in range(3):
        wakeUpTimes.append(awakeTime - (6 + (1.5 * track)))
        track -= 1
        if wakeUpTimes[x] < 0:
            wakeUpTimes[x] = 24 + wakeUpTimes[x]
    
    return jsonify({'success': True, 'wakeup_times': wakeUpTimes})

@app.route('/changeData', methods=['POST'])
def change_data():
    data = request.json
    user_id = data['user_id']
    email = data['email']
    first_name = data['first_name']
    last_name = data['last_name']
    exercise_goal = data['exercise_goal']
    skill = data['skill']
    equipment = data['equipment']
    sleep_goal = data['sleep_goal']
    wakeup_time = data['wakeup_time']
    
    data_to_update = {
        "first": first_name,
        "last": last_name,
        "email": email,
        "exercise_info": {
            "exercise_goal": exercise_goal,
            "skill": skill,
            "equipment": equipment
        },
        "sleep_info": {
            "sleep_goal": sleep_goal,
            "wakeup_time": wakeup_time
        }
    }
    
    db.collection("users").document(user_id).update(data_to_update)

    user_query = db.collection("users").where("user_id", "==", user_id).limit(1).get()
    
    if not user_query:
        return jsonify({'success': False})
    else:
        user_data = user_query[0].to_dict()
        return jsonify({'success': True, 'data': user_data})

if __name__ == '__main__':
    app.run()
