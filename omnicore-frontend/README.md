# OmniCore Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Point of Sale (POS) Module

The POS system includes:

- **Product Grid**: Display products with images and quick add-to-cart functionality
- **Cart Management**: Add, remove, and adjust quantities of products
- **Checkout Processing**: Complete transactions with receipt printing
- **Visual Feedback**: Animations and notifications for user actions
- **Keyboard Shortcuts**:
  - F2: Quick checkout
  - F3: Clear cart
- **Sound Effects**: Audio feedback for adding products and checkout
- **Product Search**: Filter products by name or category
- **Sales Summary**: View transaction details after checkout
- **Auto-closing Notifications**: Progress bar shows time until dismissal

### Dashboard (Coming Soon)

- Sales analytics
- Inventory management
- Customer tracking

## Technologies Used

- **Next.js**: React framework for frontend
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Web Audio API**: For sound effects

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
