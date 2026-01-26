/*
 Copyright (c) 2026 WSO2 LLC. (http://www.wso2.com) All Rights Reserved.

 WSO2 LLC. licenses this file to you under the Apache License,
 Version 2.0 (the "License"); you may not use this file except
 in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
*/

'use client';

import { createTheme } from '@wso2/oxygen-ui';

// WSO2 Design Tokens - Exact colors from design system
const wso2Colors = {
  primary: '#FF7300', // WSO2 Orange (primary brand color)
  primaryHover: '#FF7300',
  black: '#000000', // Pure black for text and backgrounds
  white: '#FFFFFF', // Pure white
  background: {
    light: '#F9FAFB', // Light gray background (gray-50)
    dark: '#09090B', // Dark background (zinc-950)
    paper: {
      light: '#FFFFFF', // White for cards (light mode)
      dark: '#18181B', // Zinc-900 for cards (dark mode)
    },
    sidebar: {
      light: '#FFFFFF', // White sidebar (light mode)
      dark: '#18181B', // Zinc-900 sidebar (dark mode)
    },
    filterSection: {
      light: '#F9FAFB', // Gray-50 for filter sections (light mode)
      dark: 'rgba(39, 39, 42, 0.5)', // Zinc-800 50% opacity (dark mode)
    },
    searchInput: {
      light: '#F3F4F6', // Gray-100 for search input (light mode)
      dark: '#27272A', // Zinc-800 for search input (dark mode)
    },
  },
  text: {
    primary: '#000000', // Black text (headings)
    secondary: '#494848', // Gray text (paragraphs)
    light: '#FFFFFF', // White text
    dark: '#CCCCCC', // Light gray for dark mode secondary text
  },
  border: {
    light: '#E5E7EB', // Gray-200 border
    dark: '#27272A', // Zinc-800 border
    medium: '#CCC',
  },
};

const fontFamily =
  "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const commonTheme = {
  typography: {
    fontFamily,
    h1: {
      fontSize: '2.8rem',
      fontWeight: 700,
      lineHeight: '3.6rem',
      letterSpacing: '0.008rem',
      wordSpacing: '3px',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: '2.75rem',
      letterSpacing: '0.008rem',
      wordSpacing: '3px',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: '2.3rem',
      letterSpacing: '0.008rem',
      wordSpacing: '3px',
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 400,
      lineHeight: '1.8rem',
      letterSpacing: '0.008rem',
      wordSpacing: '3px',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: '1.6rem',
      letterSpacing: '0.008rem',
      wordSpacing: '3px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '5px',
          padding: '5px 18px 7px',
          fontSize: '14px',
          fontFamily,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: wso2Colors.primary,
    },
    background: {
      default: wso2Colors.background.light, // #F9FAFB (gray-50)
      paper: wso2Colors.background.paper.light, // #FFFFFF
    },
    text: {
      primary: wso2Colors.text.primary,
      secondary: wso2Colors.text.secondary,
    },
    divider: wso2Colors.border.light,
  },
});

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: wso2Colors.primary,
    },
    background: {
      default: wso2Colors.background.dark, // #09090B (zinc-950)
      paper: wso2Colors.background.paper.dark, // #18181B (zinc-900)
    },
    text: {
      primary: wso2Colors.text.light, // White text
      secondary: wso2Colors.text.dark, // Light gray text
    },
    divider: wso2Colors.border.dark,
  },
});
