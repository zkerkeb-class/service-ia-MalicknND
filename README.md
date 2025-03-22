# Service IA - Génération d'Images

Ce service fait partie d'une architecture microservices et est responsable de la génération d'images à l'aide de l'API Stability AI.

## 🚀 Fonctionnalités

- Génération d'images à partir de descriptions textuelles (prompts)
- Support de la génération d'images multiples
- Validation des paramètres de génération
- Gestion des erreurs robuste
- Logging complet des opérations

## 🛠️ Technologies Utilisées

- Node.js
- Express.js
- Stability AI API
- Winston (logging)
- Express Validator
- Helmet (sécurité)
- CORS
- Morgan (logging HTTP)

## 📁 Structure du Projet

```
src/
├── controllers/     # Contrôleurs de l'application
├── middleware/      # Middlewares Express
├── routes/         # Routes de l'API
├── services/       # Services métier
├── utils/          # Utilitaires et helpers
└── server.js       # Point d'entrée de l'application
```

## 🔧 Configuration

1. Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```env
PORT=3000
STABILITY_API_KEY=votre_clé_api
STABILITY_API_URL=https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image
```

## 🚀 Installation

```bash
# Installation des dépendances
npm install

# Démarrage du serveur en mode développement
npm run dev

# Démarrage du serveur en mode production
npm start
```

## 📝 API Endpoints

### POST /api/images/generate

Génère une ou plusieurs images à partir d'une description textuelle.

**Paramètres de requête :**
```json
{
  "prompt": "Description de l'image",
  "width": 1024,      // Optionnel, par défaut: 1024
  "height": 1024,     // Optionnel, par défaut: 1024
  "samples": 1,       // Optionnel, par défaut: 1
  "steps": 30,        // Optionnel, par défaut: 30
  "cfgScale": 7       // Optionnel, par défaut: 7
}
```

**Contraintes de validation :**
- `prompt` : Requis
- `width` : Entre 512 et 2048 pixels
- `height` : Entre 512 et 2048 pixels
- `samples` : Entre 1 et 4
- `steps` : Entre 10 et 50
- `cfgScale` : Entre 0 et 35

**Réponse :**
- Pour une seule image : Retourne directement l'image en PNG
- Pour plusieurs images : Retourne un tableau d'objets contenant les informations des images générées

## 🔒 Sécurité

- Protection CORS configurée
- Headers de sécurité avec Helmet
- Validation des entrées avec Express Validator
- Gestion sécurisée des clés API via variables d'environnement

## 📊 Logging

- Logs HTTP avec Morgan
- Logs applicatifs avec Winston
- Gestion des erreurs centralisée

## 🧪 Tests

```bash
# Exécution des tests
npm test

# Exécution des tests avec couverture
npm run test:coverage
```

## 📦 Dépendances Principales

- express: ^4.18.2
- axios: ^1.6.0
- winston: ^3.11.0
- express-validator: ^7.0.1
- helmet: ^7.1.0
- cors: ^2.8.5
- morgan: ^1.10.0
- dotenv: ^16.3.1

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
