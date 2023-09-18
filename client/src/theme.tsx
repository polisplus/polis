export default {
  space: [0, 4, 8, 16, 24, 32, 42, 56, 72, 96, 128, 256, 512],
  fonts: {
    heading: "Rubik, sans-serif",
    body: "Rubik, sans-serif",
    survey: "Rubik, sans-serif",
    monospace: "Rubik, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 36, 40, 64, 96],
  fontWeights: {
    body: 400,
    survey: 400,
    heading: 600,
    bold: 700,
  },
  lineHeights: {
    body: 1.45,
    heading: 1.125,
  },
  colors: {
    text: "#44474d",
    textDark: "#111",
    background: "#fbf5e9",
    primary: "#5c73c9",
    secondary: "#F6F7F8",
    mediumGray: "#8f8f8f",
    lightGray: "#afafaf",
    lighterGray: "#e4e5e5",
    bgGray: "#eee9de",
    bgOffWhite: "#fbf7f1",
    primaryActive: "#4e65bd",
    secondaryActive: "#e0e4e7",
    mediumGrayActive: "#63676e",
    lightGrayActive: "#9f9f9f",
    mediumRed: "#e26666",
    mediumRedActive: "#d32d28",
    mediumGreen: "#5fa240",
    mediumGreenActive: "#448b24",
  },
  forms: {
    input: {
      fontSize: "inherit !important",
      fontFamily: "body",
      backgroundColor: "#ffffff",
      my: [2],
    },
    textarea: {
      fontSize: "inherit !important",
      fontFamily: "body",
      backgroundColor: "#ffffff",
      my: [2],
    },
  },
  links: {
    a: {
      fontWeight: "600",
      color: "primary",
      "&:active": {
        color: "primary",
      },
      "&:hover": {
        color: "primary",
        textDecoration: "underline",
      },
      "&:visited": {
        color: "primary",
      },
      textDecoration: "none",
      cursor: "pointer",
    },
    text: {
      fontWeight: "600",
      color: "primary",
      "&:active": {
        color: "primary",
      },
      "&:hover": {
        color: "primary",
        textDecoration: "underline",
      },
      textDecoration: "none",
      cursor: "pointer",
    },
    textGray: {
      fontWeight: "600",
      color: "mediumGray",
      "&:visited": {
        color: "mediumGray",
      },
      "&:active": {
        color: "mediumGrayActive",
      },
      "&:hover": {
        color: "mediumGrayActive",
        textDecoration: "underline",
      },
      textDecoration: "none",
      cursor: "pointer",
    },
    button: {
      px: "1em",
      pt: "0.7em",
      pb: "0.64em",
      borderRadius: "4px",

      backgroundColor: "primary",
      textDecoration: "none",
      color: "#fbf5e9 !important",
      "&:hover": {
        bg: "#4e65bd !important",
      },
      bg: "primary",
      fontFamily: "monospace",
      cursor: "pointer",
    },
    nav: {
      fontFamily: "monospace",
      color: "inherit",
      "&.active": {
        color: "primary",
      },
      "&:hover": {
        color: "primary",
        borderBottom: "1.5px solid",
        borderBottomColor: "primary",
      },
      textDecoration: "none",
      fontWeight: "body",
      cursor: "pointer",
      borderBottom: "1.5px solid",
      borderBottomColor: "transparent",
    },
    activeNav: {
      fontFamily: "monospace",
      color: "inherit",
      "&.active": {
        color: "primary",
      },
      "&:hover": {
        color: "primary",
        borderBottomColor: "primary",
      },
      textDecoration: "none",
      mr: [4],
      fontSize: "0.96em",
      fontWeight: "bold",
      cursor: "pointer",
      borderBottom: "1.5px solid",
      borderBottomColor: "mediumGray",
    },
  },
  buttons: {
    text: {
      bg: "transparent",
      color: "text",
      cursor: "pointer",
      fontFamily: "monospace",
      fontSize: "0.96em",
      "&:hover": {
        backgroundColor: "bgGray",
        color: "textDark",
      },
      pb: [0, 1],
      pt: [0, 1],
    },
    primary: {
      color: "background",
      bg: "primary",
      "&:hover": {
        bg: "primaryActive",
      },
      fontFamily: "monospace",
      cursor: "pointer",
    },
    secondary: {
      color: "background",
      bg: "lightGray",
      "&:hover": {
        bg: "lightGrayActive",
      },
      fontFamily: "monospace",
      cursor: "pointer",
    },
    outline: {
      color: "primary",
      bg: "background",
      fontFamily: "monospace",
      cursor: "pointer",
      border: "1px solid",
      borderColor: "primary",
      "&:hover": {
        color: "primaryActive",
        borderColor: "primaryActive",
      },
    },
    outlineSecondary: {
      color: "lightGray",
      bg: "background",
      fontFamily: "monospace",
      cursor: "pointer",
      border: "1px solid",
      borderColor: "lightGray",
      "&:hover": {
        color: "lightGrayActive",
        borderColor: "lightGrayActive",
      },
    },
    outlineDark: {
      color: "#84817D",
      bg: "background",
      fontFamily: "monospace",
      cursor: "pointer",
      border: "1px solid",
      borderColor: "#E6E0D4",
      boxShadow: "2px 2px 2px #E6E0D4",
      "&:hover": {
        boxShadow: "none",
        // color: "mediumGrayActive",
        // borderColor: "mediumGrayActive",
      },
    },
    outlineRed: {
      color: "mediumRed",
      bg: "background",
      fontFamily: "monospace",
      cursor: "pointer",
      border: "1px solid",
      borderColor: "lightGray",
      "&:hover": {
        color: "mediumRedActive",
        borderColor: "mediumRedActive",
      },
    },
    outlineGreen: {
      color: "mediumGreen",
      bg: "background",
      fontFamily: "monospace",
      cursor: "pointer",
      border: "1px solid",
      borderColor: "lightGray",
      "&:hover": {
        color: "mediumGreenActive",
        borderColor: "mediumGreenActive",
      },
    },
    outlineLightGray: {
      color: "mediumGray",
      bg: "background",
      fontFamily: "monospace",
      cursor: "pointer",
      border: "1px solid",
      borderColor: "lightGray",
      "&:hover": {
        color: "lightGrayActive",
        borderColor: "lightGrayActive",
      },
    },
    outlineGray: {
      color: "mediumGray",
      bg: "background",
      fontFamily: "monospace",
      cursor: "pointer",
      border: "1px solid",
      borderColor: "lightGray",
      "&:hover": {
        color: "mediumGrayActive",
        borderColor: "lightGrayActive",
      },
    },
  },
  cards: {
    primary: {
      backgroundColor: "background",
      color: "mediumGray",
      padding: 3,
      borderRadius: 4,
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.125)",
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    a: {
      color: "primary",
      "&:visited": {
        color: "primary",
      },
      "&:active": {
        color: "primary",
      },
      "&:hover": {
        color: "primary",
        borderBottom: "solid",
        borderWidth: 1.5,
        borderColor: "primary",
      },
      textDecoration: "none",
      cursor: "pointer",
      borderBottom: "solid",
      borderWidth: 2,
      borderColor: "transparent",
    },
  },
}
