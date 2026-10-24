// Sets data-theme on <html> before the page paints, so there is no flash of the wrong theme.
// Kept outside the "use client" theme module so the server layout can inline it as a plain string.
export const THEME_STORAGE_KEY = "theme";

export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var d=document.documentElement;d.setAttribute("data-theme",t);d.style.colorScheme=t;}catch(e){}})();`;
