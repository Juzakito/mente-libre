import json

ES_JSON_PATH = 'c:/Users/josem/.gemini/antigravity-ide/scratch/mente-libre/src/i18n/es.json'
EN_JSON_PATH = 'c:/Users/josem/.gemini/antigravity-ide/scratch/mente-libre/src/i18n/en.json'

with open(ES_JSON_PATH, 'r', encoding='utf-8') as f:
    es_data = json.load(f)
with open(EN_JSON_PATH, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Add modal deploy keys
es_data['b2bDashboard']['modalDeployTitle'] = 'Desplegar Reto de Bienestar'
es_data['b2bDashboard']['modalDeployDesc'] = 'Se enviará un plan de contención emocional y notificaciones a los 9 estudiantes en riesgo para promover su bienestar de forma prioritaria.'
es_data['b2bDashboard']['cancel'] = 'Cancelar'
es_data['b2bDashboard']['confirmDeploy'] = 'Confirmar Despliegue'
es_data['b2bDashboard']['challengeDeployed'] = 'Reto desplegado exitosamente a los estudiantes en riesgo.'

en_data['b2bDashboard']['modalDeployTitle'] = 'Deploy Wellness Challenge'
en_data['b2bDashboard']['modalDeployDesc'] = 'An emotional containment plan and notifications will be sent to the 9 at-risk students to promote their well-being as a priority.'
en_data['b2bDashboard']['cancel'] = 'Cancel'
en_data['b2bDashboard']['confirmDeploy'] = 'Confirm Deployment'
en_data['b2bDashboard']['challengeDeployed'] = 'Challenge deployed successfully to at-risk students.'

with open(ES_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(es_data, f, indent=2, ensure_ascii=False)
with open(EN_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

print("Deploy modal keys added successfully!")
