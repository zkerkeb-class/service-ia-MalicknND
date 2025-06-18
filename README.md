# Service IA - Génération d'Images avec Stability AI

## 📋 Description

Service de génération d'images par IA utilisant **Stability AI / Stable Diffusion 3.5 Large**. Ce service fait partie de l'architecture microservices et génère des images à partir de prompts textuels, puis les sauvegarde automatiquement via le service d'images.

## 🏗️ Architecture

- **Framework** : Express.js
- **IA** : Stability AI API (Stable Diffusion 3.5 Large)
- **Stockage** : Service Images (Supabase + Base de données)
- **Authentification** : Clerk
- **Port** : 9000

## 🎨 Modèles Supportés

### Stable Diffusion 3.5 Large
- **Résolution** : 1024x1024 (par défaut)
- **Format** : PNG
- **Qualité** : Haute définition
- **Style** : Réaliste, artistique, conceptuel

## 🚀 API Endpoints

### POST `/api/images/generate`
**Générer une nouvelle image**

**Headers :**
```
Authorization: Bearer <clerk-token>
Content-Type: application/json
```

**Body :**
```json
{
  "prompt": "developer",
  "options": {
    "width": 1024,
    "height": 1024,
    "steps": 30,
    "cfg_scale": 7,
    "seed": 42
  }
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "image_id": "clxxx...",
    "user_id": "user_2ta6NRH0kZxG51Gcn6gCaVzJQPe",
    "prompt": "developer",
    "image_url": "https://supabase.co/storage/v1/object/public/images/...",
    "created_at": "2025-06-18T00:00:00.000Z",
    "status": "generated",
    "metadata": {
      "generated_by": "stability-ai",
      "model": "stable-diffusion-3.5-large",
      "width": 1024,
      "height": 1024,
      "steps": 30,
      "cfg_scale": 7,
      "seed": 42
    }
  }
}
```

### GET `/api/health`
**Vérifier la santé du service**

### GET `/api/models`
**Liste des modèles disponibles**

## 🔧 Configuration

### Variables d'environnement

```env
# Serveur
PORT=9000

# Stability AI
STABILITY_API_KEY=sk-xxx...

# Clerk (Authentification)
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Service Images
IMAGE_SERVICE_URL=http://localhost:5002

# Logging
LOG_LEVEL=info
```

### Scripts disponibles

```bash
# Développement
npm run dev

# Production
npm start

# Tests
npm test
```

## 🔄 Workflow de Génération

### 1. Réception de la requête
```javascript
// Frontend envoie
{
  prompt: "developer",
  options: { width: 1024, height: 1024, steps: 30 }
}
```

### 2. Génération avec Stability AI
```javascript
// Appel à l'API Stability AI
const response = await stabilityAI.textToImage({
  text_prompts: [{ text: prompt }],
  cfg_scale: options.cfg_scale || 7,
  height: options.height || 1024,
  width: options.width || 1024,
  samples: 1,
  steps: options.steps || 30,
});
```

### 3. Sauvegarde automatique
```javascript
// Envoi au service Images
const saveResponse = await imageService.createImage({
  prompt,
  imageData: base64Image,
  metadata: {
    generated_by: "stability-ai",
    model: "stable-diffusion-3.5-large",
    ...options
  }
});
```

### 4. Réponse finale
```javascript
// Retour au frontend avec l'image générée et sauvegardée
{
  success: true,
  data: { image_id, image_url, prompt, metadata }
}
```

## 🎛️ Options de Génération

### Paramètres principaux
- **prompt** : Description de l'image à générer (requis)
- **width** : Largeur en pixels (défaut: 1024)
- **height** : Hauteur en pixels (défaut: 1024)
- **steps** : Nombre d'étapes de génération (défaut: 30)
- **cfg_scale** : Échelle de guidance (défaut: 7)
- **seed** : Graine aléatoire (optionnel)

### Exemples de prompts
```javascript
// Réaliste
"professional developer working at a modern desk with multiple monitors"

// Artistique
"digital art of a developer, cyberpunk style, neon colors"

// Conceptuel
"abstract representation of coding and technology"
```

## 🔐 Sécurité

### Authentification
- Vérification des tokens Clerk
- Extraction automatique de l'ID utilisateur
- Middleware d'authentification sur toutes les routes

### Validation
- Validation des prompts (longueur, contenu)
- Limitation des options de génération
- Rate limiting par utilisateur

### Rate Limiting
- **Limite** : 10 générations/minute par utilisateur
- **Cooldown** : 30 secondes entre les générations
- **Quota** : 100 générations/jour par utilisateur

## 📊 Métadonnées

### Informations enregistrées
```javascript
{
  generated_by: "stability-ai",
  model: "stable-diffusion-3.5-large",
  timestamp: "2025-06-18T00:39:32.148Z",
  width: 1024,
  height: 1024,
  steps: 30,
  cfgScale: 7,
  seed: 42,
  generated_at: "2025-06-18T00:39:37.379Z"
}
```

### Stockage
- **Supabase** : Image PNG
- **Base de données** : Métadonnées + URL
- **Historique** : Toutes les générations par utilisateur

## 🐛 Débogage

### Logs structurés
```
info: Génération d'image avec prompt: developer
info: Token reçu du frontend: eyJhbGciOiJSUzI1NiIs...
info: Sauvegarde de l'image générée via le service Image...
info: Utilisation du token Clerk: eyJhbGciOiJSUzI1NiIs...
error: Erreur lors de la sauvegarde de l'image: Request failed with status code 500
```

### Erreurs courantes
- **401** : Token Clerk invalide
- **400** : Prompt invalide ou manquant
- **429** : Rate limit dépassé
- **500** : Erreur Stability AI ou Service Images

### Health Check
```bash
curl http://localhost:9000/api/health
```

## 📈 Performance

### Optimisations
- **Cache** : Mise en cache des prompts fréquents
- **Compression** : Images optimisées avant sauvegarde
- **Connexions** : Pool de connexions HTTP
- **Validation** : Validation rapide des données

### Métriques
- **Temps de génération** : 15-30 secondes
- **Taille d'image** : ~2-5MB par image
- **Concurrence** : 5 générations simultanées max

## 🔗 Intégration

### Services connectés
- **Frontend** : Interface utilisateur
- **Service Images** : Stockage et gestion
- **Service BDD** : Persistance des métadonnées
- **Stability AI** : Génération d'images

### Communication
```javascript
// Frontend → Service IA
POST /api/images/generate
{ prompt, options }

// Service IA → Stability AI
POST /v1/generation/stable-diffusion-3-5-large/text-to-image
{ text_prompts, cfg_scale, height, width, steps }

// Service IA → Service Images
POST /api/images
{ prompt, imageData, metadata }
```

## 🧪 Tests

### Tests unitaires
```bash
npm test
```

### Tests d'intégration
```bash
# Test complet Frontend → IA → Images → BDD
node test-integration.js
```

### Tests manuels
```bash
# Test de génération
curl -X POST http://localhost:9000/api/images/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"developer","options":{"steps":20}}'
```

## 📝 Notes de développement

### Bonnes pratiques
- **Prompts** : Utiliser des descriptions détaillées
- **Options** : Ajuster selon le style souhaité
- **Métadonnées** : Toujours inclure les paramètres utilisés
- **Erreurs** : Gérer les timeouts de l'API Stability AI

### Limitations
- **API Stability AI** : Limites de rate et de quota
- **Temps de génération** : Variable selon la complexité
- **Formats** : PNG uniquement pour l'instant
- **Résolutions** : 1024x1024 recommandé

### Évolutions futures
- Support d'autres modèles (SDXL, etc.)
- Génération par lots
- Styles prédéfinis
- Optimisation des prompts 