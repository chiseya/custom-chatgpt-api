# Custom-ChatGPT-API
An API wrapper for OpenAI's Chat completion with some features:
- System prompts
- Chat history
- Authentication (Currently only supports Google OAuth2)

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- A relational database (PostgreSQL is recommended)

### Installation

```shell
git clone https://github.com/chiseya/custom-chatgpt-api.git
cd custom-chatgpt-api
npm install
```

After this, generate the Prisma client:
```shell
npx prisma generate
```

Please ensure you have a .env file in your root directory with your database credentials, as Prisma will use it to connect to your database. The .env file should be something like this:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
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
