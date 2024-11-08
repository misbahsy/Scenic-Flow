# 🎬 ScenicFlow - Powered by Langflow and Groq

A web-based scene/slide creator built with Vite and React that allows you to create engaging video presentations. Create slides and scenes manually by adding text and images, or let AI automatically generate scenes for you using Langflow integration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Development Server](#running-the-development-server)
- [Building for Production](#building-for-production)
- [Linting](#linting)
- [Learn More](#learn-more)
- [Deploying](#deploying)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install the latest version from the [Node.js Official Website](https://nodejs.org/).
- **Package Manager**: Choose one of the following for managing dependencies:
  - [npm](https://www.npmjs.com/)
  - [Yarn](https://yarnpkg.com/)
  - [pnpm](https://pnpm.io/)
  - [Bun](https://bun.sh/)

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/misbahsy/txt-to-video
   cd video-editor
   ```

2. **Install Dependencies**

   Choose your preferred package manager to install the required dependencies:

   ```bash
   # Using npm
   npm install

   # Using Yarn
   yarn install

   # Using pnpm
   pnpm install

   # Using Bun
   bun install
   ```

## Configuration

### 1. Create a Free Langflow Account

- Visit [Astra Datastax Langflow](https://astra.datastax.com/) to create a free Langflow account.
- Follow the registration process and verify your email if required.

### 2. Obtain Langflow API Token and Base Path

- After logging in, navigate to the Langflow dashboard.
- Generate or retrieve your **API Token**.
- Note down the **Base Path** for the Langflow API.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:
```env
VITE_ASTRA_LANGFLOW_TOKEN=AstraCS:xxxx
VITE_LANGFLOW_BASE_PATH="/api/langflow/lf/xxxxxx-xxxx-xxx-xxxx/api/v1/run/flow-id"
```

**Note:** Ensure that VITE_LANGFLOW_BASE_PATH starts with /api/langflow/... which is available from </>API tab at the bottom right of the Langflow UI. Also make sure `.env` is **not** committed to version control to keep your API tokens secure.

### 4. Import Langflow Flow

You can use the predefined flow located at `src/utils/langflow_flow/Slides with images.json`. Simply drag and drop this flow into the Langflow dashboard to get started.

## Running the Development Server

Start the development server using your chosen package manager:

```bash
# Using npm
npm run dev

# Using Yarn
yarn dev

# Using pnpm
pnpm dev

# Using Bun
bun dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
- The app will automatically reload if you make changes to the code.

## Building for Production

To create an optimized production build, run the following command with your preferred package manager:

```bash
# Using npm
npm run build

# Using Yarn
yarn build

# Using pnpm
pnpm build

# Using Bun
bun build
```

The build artifacts will be stored in the `dist/` directory.

## Linting

Ensure code quality and consistency by running the linter:

```bash
# Using npm
npm run lint

# Using Yarn
yarn lint

# Using pnpm
pnpm lint

# Using Bun
bun lint
```

The linter checks for syntax errors and enforces coding standards based on the `.eslintrc.json` configuration.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Langflow Documentation](https://astra.datastax.com/docs/langflow)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploying

Deploy your application using your preferred hosting platform. For optimal performance and ease of deployment, consider using platforms like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

For more details on deploying with Vite, refer to the [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html).
# End of Selection
```