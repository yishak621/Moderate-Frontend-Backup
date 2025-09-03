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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
src/
├── app/
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Landing page
│ ├── auth/ # Auth pages
│ │ ├── login/page.tsx
│ │ ├── register/page.tsx
│ │ └── forgot-password/page.tsx
│ ├── dashboard/ # Shared dashboard layout
│ │ ├── layout.tsx
│ │ ├── admin/page.tsx # Admin home
│ │ ├── teacher/page.tsx # Teacher home
│ │ └── student/page.tsx # Student home
│ └── settings/page.tsx # User settings
│
├── components/ # Reusable UI
│ ├── ui/ # Atoms
│ │ ├── Button.tsx
│ │ ├── Input.tsx
│ │ ├── Modal.tsx
│ │ └── Table.tsx
│ ├── Navbar.tsx
│ ├── Sidebar.tsx
│ └── Card.tsx
│
├── modules/ # Feature-specific parts
│ ├── auth/ # Login/Register forms
│ │ ├── LoginForm.tsx
│ │ └── RegisterForm.tsx
│ ├── dashboard/ # Shared dashboard widgets
│ │ ├── StatsCards.tsx
│ │ ├── ActivityFeed.tsx
│ │ └── Notifications.tsx
│ ├── exams/ # Exams module
│ │ ├── ExamUpload.tsx
│ │ └── ExamList.tsx
│ ├── grading/ # Grading module
│ │ ├── GradeTable.tsx
│ │ └── GradeForm.tsx
│  
 │
├── hooks/ # Custom hooks
│ ├── useAuth.ts # Manage login/logout, token, user state
│ ├── useAxios.ts # Axios with interceptors
│ ├── useUser.ts # Fetch current user profile
│
│ ├── useExams.ts # CRUD for exams
│ ├── useGrades.ts # Manage grading logic
│ ├── useDebounce.ts # Search/filter helpers
│ └── useModal.ts # Reusable modal toggle
│
├── services/ # API calls
│ ├── authService.ts
│
│ ├── examService.ts
│ └── gradeService.ts
│
├── lib/
│ ├── axios.ts # Axios instance
│ └── constants.ts # Roles, routes, config
│
├── types/
│ ├── auth.ts
│ ├── student.ts
│ ├── exam.ts
│ └── grade.ts
│
└── assets/ # Images/icons
