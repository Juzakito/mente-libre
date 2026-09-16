import json

ES_JSON_PATH = 'c:/Users/josem/.gemini/antigravity-ide/scratch/mente-libre/src/i18n/es.json'
EN_JSON_PATH = 'c:/Users/josem/.gemini/antigravity-ide/scratch/mente-libre/src/i18n/en.json'

with open(ES_JSON_PATH, 'r', encoding='utf-8') as f:
    es_data = json.load(f)
with open(EN_JSON_PATH, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Add missing student.nav keys
es_data['student']['nav']['experts'] = 'Conecta con un experto'
es_data['student']['nav']['myAppointments'] = 'Mis citas'
es_data['student']['nav']['installApp'] = 'Instalar App'
es_data['student']['nav']['expertsMobile'] = 'Expertos'
es_data['student']['nav']['shareApp'] = 'Compartir App'
es_data['student']['nav']['iosInstall'] = "Toca 'Compartir' y luego 'Añadir a inicio' 📱"

en_data['student']['nav']['experts'] = 'Connect with an expert'
en_data['student']['nav']['myAppointments'] = 'My appointments'
en_data['student']['nav']['installApp'] = 'Install App'
en_data['student']['nav']['expertsMobile'] = 'Experts'
en_data['student']['nav']['shareApp'] = 'Share App'
en_data['student']['nav']['iosInstall'] = "Tap 'Share' then 'Add to Home Screen' 📱"

with open(ES_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(es_data, f, indent=2, ensure_ascii=False)
with open(EN_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

print("Student nav keys added successfully!")
