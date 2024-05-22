# My TypeScript Node.js Project

This is a simple Node.js project built with TypeScript. It provides two endpoints: a GET endpoint that responds with "Hello World" and a POST endpoint for identifying contacts.

**API Hosted URL:** `https://bitespeed-assessment-rayn.onrender.com/`

## Installation

1. Clone the repository
    ```bash
    git clone https://github.com/mrsingh-rishi/bitespeed-assessment.git
    ```
2. Navigate to the project directory
    ```bash
    cd bitespeed-assessment
    ```
3. Install the dependencies
    ```bash
    npm install
    ```

## Scripts

- **Build the project**
    ```bash
    npm run build && npx prisma generate
    ```
    This will compile the TypeScript files into JavaScript files.

- **Start the project**
    ```bash
    npm start
    ```
    This will run the compiled JavaScript files.

- **Run the project in development mode**
    ```bash
    npm run dev
    ```
    This will run the project using `ts-node` for development.

## Endpoints

### GET /

**Description:** Responds with "Hello World".

**Example Request:**
```bash
curl http://localhost:3000/
```

```bash
Hello World
```

# POST /identify Endpoint

This endpoint identifies contacts based on the provided email and phone number. It checks if a contact exists with the given email or phone number. If a contact exists, it updates the contacts accordingly; otherwise, it creates a new contact. The response includes the primary contact's details and linked secondary contacts.

## Request

**URL:** `/identify`

**Method:** `POST`

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "string",
  "phoneNumber": "string"
}
```

```bash
curl -X POST http://localhost:3000/identify -H "Content-Type: application/json" -d '{
    "email": "george@hillvalley.edu",
    "phoneNumber": "717171"
}'
```

## Response

**Response Body:**
```json
{
    "contact": {
        "primaryContactId": number,
        "emails": ["string"], 
        "phoneNumbers": ["string"],  
        "secondaryContactIds": [number] 
    }
}
```

### Example Response

**Example Request:**
```bash
curl -X POST http://localhost:3000/identify -H "Content-Type: application/json" -d '{
    "email": "george@hillvalley.edu",
    "phoneNumber": "717171"
}'
```

** Example Response**
```bash
{
    "contact": {
        "primaryContactId": 11,
        "emails": ["george@hillvalley.edu", "biffsucks@hillvalley.edu"],
        "phoneNumbers": ["919191", "717171"],
        "secondaryContactIds": [27]
    }
}
```
