# AI Service - Image Generation

This service is part of a microservices architecture and is responsible for generating images using the Stability AI API.

## 🚀 Features

- Image generation from text descriptions (prompts)
- Support for multiple image generation
- Parameter validation
- Robust error handling
- Comprehensive logging

## 🛠️ Technologies Used

- Node.js
- Express.js
- Stability AI API
- Winston (logging)
- Express Validator
- Helmet (security)
- CORS
- Morgan (HTTP logging)

## 📁 Project Structure

```
src/
├── controllers/     # Application controllers
├── middleware/      # Express middlewares
├── routes/         # API routes
├── services/       # Business services
├── utils/          # Utilities and helpers
└── server.js       # Application entry point
```

## 🔧 Configuration

1. Create a `.env` file in the project root with the following variables:

```env
PORT=3000
STABILITY_API_KEY=your_api_key
STABILITY_API_URL=https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image
```

## 🚀 Installation

```bash
# Install dependencies
npm install

# Start server in development mode
npm run dev

# Start server in production mode
npm start
```

## 📝 API Endpoints

### POST /api/images/generate

Generates one or multiple images from a text description.

**Request Parameters:**
```json
{
  "prompt": "Image description",
  "width": 1024,      // Optional, default: 1024
  "height": 1024,     // Optional, default: 1024
  "samples": 1,       // Optional, default: 1
  "steps": 30,        // Optional, default: 30
  "cfgScale": 7       // Optional, default: 7
}
```

**Validation Constraints:**
- `prompt`: Required
- `width`: Between 512 and 2048 pixels
- `height`: Between 512 and 2048 pixels
- `samples`: Between 1 and 4
- `steps`: Between 10 and 50
- `cfgScale`: Between 0 and 35

**Response:**
- For a single image: Returns the image directly in PNG format
- For multiple images: Returns an array of objects containing the generated images information

## 🔒 Security

- CORS protection configured
- Security headers with Helmet
- Input validation with Express Validator
- Secure API key management through environment variables

## 📊 Logging

- HTTP logging with Morgan
- Application logging with Winston
- Centralized error handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Main Dependencies

- express: ^4.18.2
- axios: ^1.6.0
- winston: ^3.11.0
- express-validator: ^7.0.1
- helmet: ^7.1.0
- cors: ^2.8.5
- morgan: ^1.10.0
- dotenv: ^16.3.1

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
