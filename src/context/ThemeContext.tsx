"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const readInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  const savedTheme = window.localStorage.getItem("digitalaccess.theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }
  return "dark"; // Default fallback
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, read the theme from local storage just in case it differs from initial render
    const initialTheme = readInitialTheme();
    setThemeState(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Update favicon
    const fav = document.getElementById("app-favicon");
    if (fav) {
      fav.setAttribute("href", theme === "light" ? "/Blue.png" : "/White.png");
    }
    
    // Only update local storage after mounting
    if (mounted) {
      window.localStorage.setItem("digitalaccess.theme", theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
