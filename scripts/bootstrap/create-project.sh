#!/usr/bin/env bash
# IMO Creator Bootstrap Script - Complete Solo Developer Stack
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PROJECT_NAME=""
PROJECT_TYPE="nextjs"
USE_AUTH="true"
USE_DB="true"
USE_MONITORING="true"

# Help function
show_help() {
    cat << EOF
IMO Creator Bootstrap Script - Complete Solo Developer Stack

Usage: ./create-project.sh [OPTIONS] <project-name>

Options:
    -t, --type TYPE         Project type (nextjs, vite, expo) [default: nextjs]
    -n, --no-auth          Skip authentication setup
    -d, --no-db            Skip database setup
    -m, --no-monitoring    Skip monitoring/analytics setup
    -h, --help             Show this help message

Examples:
    ./create-project.sh my-awesome-app
    ./create-project.sh -t vite --no-auth my-spa
    ./create-project.sh -d -m my-simple-site

Features included by default:
    ✅ TypeScript + Modern React
    ✅ Tailwind CSS + Shadcn UI
    ✅ Authentication (Clerk)
    ✅ Database (Drizzle + PlanetScale)
    ✅ State Management (Zustand)
    ✅ API Layer (tRPC)
    ✅ Error Tracking (Sentry)
    ✅ Performance Monitoring (BMAD)
    ✅ Git Hooks + Solo-friendly CI
    ✅ Vercel Deployment Config
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--type)
            PROJECT_TYPE="$2"
            shift 2
            ;;
        -n|--no-auth)
            USE_AUTH="false"
            shift
            ;;
        -d|--no-db)
            USE_DB="false"
            shift
            ;;
        -m|--no-monitoring)
            USE_MONITORING="false"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        -*)
            echo "Unknown option $1"
            show_help
            exit 1
            ;;
        *)
            PROJECT_NAME="$1"
            shift
            ;;
    esac
done

# Validate project name
if [[ -z "$PROJECT_NAME" ]]; then
    echo -e "${RED}Error: Project name is required${NC}"
    show_help
    exit 1
fi

# Validate project name format
if [[ ! "$PROJECT_NAME" =~ ^[a-zA-Z0-9-]+$ ]]; then
    echo -e "${RED}Error: Project name can only contain letters, numbers, and hyphens${NC}"
    exit 1
fi

# Check if directory already exists
if [[ -d "$PROJECT_NAME" ]]; then
    echo -e "${RED}Error: Directory '$PROJECT_NAME' already exists${NC}"
    exit 1
fi

# Start bootstrap process
echo -e "${BLUE}🚀 IMO Creator Bootstrap - Creating '$PROJECT_NAME'${NC}"
echo -e "${BLUE}   Type: $PROJECT_TYPE | Auth: $USE_AUTH | DB: $USE_DB | Monitoring: $USE_MONITORING${NC}"
echo ""

# Create Next.js project with TypeScript and Tailwind
echo -e "${YELLOW}📦 Creating Next.js project...${NC}"
npx create-next-app@latest "$PROJECT_NAME" \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --import-alias "@/*"

cd "$PROJECT_NAME"

# Install core dependencies
echo -e "${YELLOW}🔧 Installing core dependencies...${NC}"
npm install \
    @headlessui/react \
    @heroicons/react \
    class-variance-authority \
    clsx \
    lucide-react \
    next-themes \
    tailwind-merge \
    tailwindcss-animate \
    zustand \
    immer

# Install dev dependencies
npm install -D \
    @types/node \
    prettier \
    prettier-plugin-tailwindcss

# Install authentication if enabled
if [[ "$USE_AUTH" == "true" ]]; then
    echo -e "${YELLOW}🔐 Setting up authentication (Clerk)...${NC}"
    npm install @clerk/nextjs @clerk/themes
fi

# Install database if enabled
if [[ "$USE_DB" == "true" ]]; then
    echo -e "${YELLOW}💾 Setting up database (Drizzle + PlanetScale)...${NC}"
    npm install \
        drizzle-orm \
        @planetscale/database \
        drizzle-kit \
        mysql2 \
        @paralleldrive/cuid2
fi

# Install tRPC for API layer
echo -e "${YELLOW}🔌 Setting up tRPC API layer...${NC}"
npm install \
    @trpc/server \
    @trpc/client \
    @trpc/next \
    @trpc/react-query \
    @tanstack/react-query \
    zod

# Install monitoring if enabled
if [[ "$USE_MONITORING" == "true" ]]; then
    echo -e "${YELLOW}📊 Setting up monitoring (Sentry)...${NC}"
    npm install @sentry/nextjs
fi

# Copy template files from IMO Creator
echo -e "${YELLOW}📁 Copying IMO Creator template files...${NC}"

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Copy configuration files
cp "$IMO_ROOT/tailwind.config.ts" ./
cp "$IMO_ROOT/components.json" ./
cp "$IMO_ROOT/next.config.js" ./

# Copy essential directories
cp -r "$IMO_ROOT/src/components" ./src/
cp -r "$IMO_ROOT/src/lib" ./src/
cp -r "$IMO_ROOT/src/styles" ./src/

# Setup BMAD system (simplified for new projects)
echo -e "${YELLOW}⚡ Setting up BMAD performance monitoring...${NC}"
mkdir -p bmad logs/bmad logs/baseline scripts/bmad scripts/git-hooks

# Copy BMAD scripts
cp "$IMO_ROOT/bmad/measure.sh" ./bmad/
cp "$IMO_ROOT/scripts/bmad/baseline.py" ./scripts/bmad/
cp "$IMO_ROOT/scripts/git-hooks"/* ./scripts/git-hooks/

# Make scripts executable
chmod +x bmad/*.sh scripts/**/*.sh scripts/**/*.py

# Setup git hooks
cp scripts/git-hooks/* .git/hooks/
chmod +x .git/hooks/*

# Create basic project structure
mkdir -p src/app/api/trpc
mkdir -p src/pages/api/trpc

# Setup environment file
cat > .env.local << 'EOF'
# Database (PlanetScale)
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Monitoring (Sentry)
NEXT_PUBLIC_SENTRY_DSN=

# BMAD Configuration
BMAD_STRICT=0
BMAD_LOG_ENDPOINT=
EOF

# Setup package.json scripts
echo -e "${YELLOW}⚙️ Configuring package.json scripts...${NC}"
npm pkg set scripts.bmad:bench="./bmad/measure.sh"
npm pkg set scripts.bmad:analyze="python3 scripts/bmad/baseline.py"
npm pkg set scripts.db:generate="drizzle-kit generate"
npm pkg set scripts.db:push="drizzle-kit push"
npm pkg set scripts.db:studio="drizzle-kit studio"

# Create Vercel deployment config
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "DATABASE_HOST": "@database-host",
    "DATABASE_USERNAME": "@database-username", 
    "DATABASE_PASSWORD": "@database-password",
    "DATABASE_NAME": "@database-name",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@clerk-publishable-key",
    "CLERK_SECRET_KEY": "@clerk-secret-key",
    "NEXT_PUBLIC_SENTRY_DSN": "@sentry-dsn"
  }
}
EOF

# Create README with setup instructions
cat > README.md << EOF
# $PROJECT_NAME

Created with IMO Creator Bootstrap - Complete solo developer stack.

## 🚀 Features

- ⚡ **Next.js 14** with App Router and TypeScript
- 🎨 **Tailwind CSS** + Shadcn UI components
- 🔐 **Authentication** with Clerk (if enabled)
- 💾 **Database** with Drizzle ORM + PlanetScale (if enabled)
- 🔌 **Type-safe APIs** with tRPC
- 🧠 **State Management** with Zustand
- 📊 **Error Tracking** with Sentry (if enabled)
- ⚡ **Performance Monitoring** with BMAD
- 🔧 **Solo-friendly Git Hooks**
- 🚀 **One-click Vercel Deployment**

## 🛠️ Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Setup environment variables:**
   Copy \`.env.local\` and fill in your values

3. **Run development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📊 BMAD Performance Monitoring

- **Benchmark your code:** \`npm run bmad:bench "your-command"\`
- **Analyze performance:** \`npm run bmad:analyze\`
- **Solo mode by default:** No strict enforcement unless \`BMAD_STRICT=1\`

## 🔧 Development

- **Database migrations:** \`npm run db:generate && npm run db:push\`
- **Database studio:** \`npm run db:studio\`
- **Type-safe API calls:** Use the tRPC client in \`src/lib/trpc/client.ts\`

## 🚀 Deployment

1. **Connect to Vercel:** \`vercel\`
2. **Set environment variables** in Vercel dashboard
3. **Push to deploy:** Automatic deployments on git push

## 💡 Solo Developer Benefits

This stack is optimized for solo development:
- Minimal configuration overhead
- Optional strict mode for production
- Performance monitoring without complexity
- Authentication and database ready to go
- Error tracking for production issues

Built with ❤️ using IMO Creator
EOF

# Initialize git repository
echo -e "${YELLOW}📝 Initializing git repository...${NC}"
git init
git add .
git commit -m "feat: initial IMO Creator project setup

🚀 Complete solo developer stack initialized:
- Next.js 14 + TypeScript
- Tailwind CSS + Shadcn UI
- Authentication (Clerk): $USE_AUTH
- Database (Drizzle): $USE_DB  
- Monitoring (Sentry): $USE_MONITORING
- tRPC API layer
- Zustand state management
- BMAD performance monitoring (solo mode)
- Git hooks configured

Ready for development! 🎉"

# Final success message
echo ""
echo -e "${GREEN}✅ Project '$PROJECT_NAME' created successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. cd $PROJECT_NAME"
echo -e "  2. Copy .env.local and add your API keys"
echo -e "  3. npm run dev"
echo ""
echo -e "${BLUE}Optional setup:${NC}"
if [[ "$USE_DB" == "true" ]]; then
    echo -e "  • Set up PlanetScale database and run: npm run db:push"
fi
if [[ "$USE_AUTH" == "true" ]]; then
    echo -e "  • Configure Clerk authentication keys"
fi
if [[ "$USE_MONITORING" == "true" ]]; then
    echo -e "  • Set up Sentry project and add DSN"
fi
echo -e "  • Connect to Vercel for deployment"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"