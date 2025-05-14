# 🍽️ Digital Menu - Expressoft

This project is a simplified **Digital Menu App** built with **ReactJS**. It's meant to simulate a food ordering interface for a restaurant. This version is provided as a **starter template** for candidates undergoing front-end technical evaluation.

---

## 🚀 Tech Stack

- [Vite](https://vitejs.dev)
- [ReactJS](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwindcss](https://tailwindcss.com)
- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)

---

## 🧾 Dummy Data Structure

The menu is organized by categories (Pizza, Burgers, Drinks) with nested products, each having:

- `id` (GUID)
- `name`
- `description`
- `price`
- `available`

You can find this in `src/data/menuData.js`

---

## 🧪 Assignment Tasks (4 hours max)

> You should use clean, reusable components and demonstrate best practices in React. Feel free to use any component libraries or utility hooks if needed.

### ✅ Must Have (Core Tasks)

1. **Menu Display by Category**
   Render the categories and list products beneath each one.

2. **Product Card**
   Each product should show:

   - Name
   - Description
   - Price
   - Availability indicator (e.g., green/red dot or “Not available” badge)

3. **Filter by Category**
   Add buttons or a dropdown to filter products shown by category.

4. **Toggle Product Availability**
   Add a toggle (e.g., a switch or checkbox) to simulate changing product availability. This should only affect the frontend state.

5. **"Add to Order" Button**
   Let users add available products to a simulated “order cart”. Show a summary with:

   - Product name
   - Quantity
   - Subtotal
   - Total price

6. **Make a welcoming home page**
   Create a home page where you can change language (optional) and start order navigating
   to menu screen, be creative.

---

### 🧠 Bonus (Optional If Time Permits)

- **Search bar** to filter products by name
- **Sort dropdown** (e.g., sort by price ascending/descending)
- **Responsive layout** for mobile/tablet
- **Modal** for viewing full product details

---

## 🧱 Folder Structure (Suggested)

```
src/
├── components/
│   ├── ProductCard.tsx
│   ├── CategoryFilter.tsx
│   └── CartSummary.tsx
├── data/
│   └── menuData.ts
├── pages/
│   ├── Menu.tsx
│   └── Home.tsx
└── App.tsx
```

---

## ▶️ Getting Started

npm install
npm run dev

---

## 📩 Submission

Please provide:

- A link to a public GitHub repo
- Any notes about what was completed, skipped, or added extra

---

## 📘 Notes

- Don’t worry about API or backend – everything is in local state.
- Use your own judgment for component breakdown and UI styling.
- Keep it modular, readable, and maintainable.

Good luck! 🚀
