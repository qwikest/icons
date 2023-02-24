# Qwik Icons

Include popular icons easily in your Qwik projects with `@qwikest/icons` 🚀

Currently included libraries (with icon prefix):

- `Lu`: [Lucide](https://lucide.dev/) icons
- `Go`: [Octicons](https://primer.style/design/foundations/icons/) by GitHub
- `Hi`: [Heroicons](https://heroicons.com/) by Tailwind
- `Io`: [Ionicons](https://ionic.io/ionicons) by Ionic

## Installation

Simply install the package with your package manager of choice:

```bash
npm i @qwikest/icons
yarn add @qwikest/icons
pnpm add @qwikest/icons
```

## Usage

```tsx
import { LuRocket } from "@qwikest/icons/lucide";

export const MyComponent = component$(() => {
  // Icon size and color are inherited by default ⬇️
  return (
    <div style={{ color: "red", fontSize: "40px" }}>
      <LuRocket />
    </div>
  );
});
```

## Available Libraries

```tsx
import { GoFlame24, .. } from "@qwikest/icons/octicons";
import { HiAcademicCapMini, .. } from "@qwikest/icons/heroicons";
import { IoAirplane, .. } from "@qwikest/icons/ionicons";
import { LuRocket, .. } from "@qwikest/icons/lucide";
```

> **Missing a library?** Feel free to open an issue or even a MR 🤝
