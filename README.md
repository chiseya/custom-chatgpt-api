# Custom-ChatGPT-API

An API wrapper for OpenAI's Chat completion with some features:

- System prompts
- Chat history
- Authentication (Currently only supports Google OAuth2)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- A relational database (PostgreSQL is recommended)
- An OpenAI API KEY with access to GPT-4
- Google OAuth Client ID and Client Ssecret

### Installation

```shell
git clone https://github.com/chiseya/custom-chatgpt-api.git
cd custom-chatgpt-api
npm install
```

Next, copy the .env.example file and rename it to .env:

```shell
cp .env.example .env
```

Open the .env file and replace the placeholder values with your actual credentials. This includes your database credentials, OpenAI API KEY, Google OAuth2 Client ID and Secret, and any other necessary variables. Your .env file should look similar to this:

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
OPENAI_API_KEY="your-api-key"
OPENAI_ORG_ID="your-organization-id"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

Now, generate the Prisma client:

```shell
npx prisma generate
```

### Usage

To start development server, run:

```shell
npm run dev
```

Before creating a production build, you need to migrate your database schema changes with Prisma:

```shell
npx prisma migrate deploy
```

To create a production build and start the server, run:

```shell
npm run build
npm start
```
