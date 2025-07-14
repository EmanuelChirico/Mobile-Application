# 📱 MemoLuggage

This repository contains the codebase for MemoLuggage, a group project focused on the design and development of a cross-platform mobile application for saving and organizing travel experiences.

---

## 🚀 Technologies Used

- **React Native** – for building native apps using JavaScript and React. 
- **JavaScript / TypeScript** – for writing clean, maintainable code. 
- **Expo** - for testing application during the coding.

---

## 📂 Project Structure

```text
my-app/
├── .expo/                  # Expo configuration files
├── app/
│   ├── (tabs)/             # Tab navigation structure
│   │   ├── _layout.tsx
│   │   ├── add.tsx
│   │   ├── explore.tsx
|   |   ├── index.tsx
|   |   ├── map.tsx
│   │   └── statistics.tsx
│   ├── travel/
|   |   ├── [id].tsx
│   ├── [edit].tsx 
|   ├── _layout.tsx 
|   ├── +not-found.tsx
│   ├── assets/             # Images, fonts, icons
│   ├── components/         # Reusable UI components
│   ├── constants/          # Static values and config
│   ├── hooks/              # Custom hooks
│   ├── scripts/            # Project scripts
│   ├── services/           # API calls or business logic
│   └── types/              # TypeScript types
├── .gitignore
├── app.json                # Expo app configuration
├── eslint.config.js        # Linting rules
├── expo-env.d.ts           # Type definitions for Expo environment
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json           # TypeScript configuration
├── yarn.lock

myapp-backend/
├── node_modules/
├── .env                    # configuration db file
├── index.js                # Backend entry point
├── package-lock.json
└── package.json

```

## 🧑‍💻 Team

This project is developed collaboratively as part of a group assignment.  
Team members:
- **Chirico Emanuel**, E-mail: e.chirico6@studenti.unisa.it
- **Ciniello Lorenzo**, E-mail: l.ciniello@studenti.unisa.it
- **Di Carluccio Alessandro**, E-mail: a.dicarluccio3@studenti.unisa.it
- **Donato Simone**, E-mail: s.donato6@studenti.unisa.it
- **Giacchetta Corradomaria**, E-mail: c.giacchetta@studenti.unisa.it

---

## ⚙️ Getting Started

To run the project locally you must have some requirements:

1) Make sure you have installed PostgreSQL on you personal computer.
2) Make sure you have installed Node.js on your computer.

### 1. Clone the repository
```text
git clone https://github.com/EmanuelChirico/Mobile-Application.git
```
### 2. Move to App/

### 3. Move to App/myapp-backend
In this section, you must change the **.env** file, putting your personal password of PostgreSQL.
Then, you must create tables in  order to store data about your travels.
You will find all the create tables in ***utils/tables.md***.

### 4. Move to App/my-app/constants/
In this folder, you must change **costants.ts** putting your personal IPv4.

### 5. Move to App/myapp-backend 
Now, open the terminal and write:

```text
node index.js
```
And your db will be started!

### 6. Move to App/my-app/
Now, open the terminal and write:
```text
npx expo start
```
At the end of this process, you will be able to use your application!
