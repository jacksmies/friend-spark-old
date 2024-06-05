import React, { useState, useEffect, useRef } from 'react'
import { SessionProvider } from 'next-auth/react'
import Head from "next/head";
import Router, { useRouter } from "next/router";
import getConfig from "next/config";
import styled, {
  ThemeProvider,
  createGlobalStyle,
  keyframes,
} from "styled-components";
import { useCookies } from "react-cookie";
import { Menu } from "@styled-icons/boxicons-regular/Menu";
import { Sun } from "@styled-icons/boxicons-regular/Sun";
import { Moon } from "@styled-icons/boxicons-regular/Moon";
import { Bell } from "@styled-icons/boxicons-regular/Bell";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { Sort } from "@styled-icons/boxicons-regular/Sort";
import { CaretUp } from "@styled-icons/boxicons-regular/CaretUp";
import { CaretDown } from "@styled-icons/boxicons-regular/CaretDown";
import { Run } from "@styled-icons/boxicons-regular/Run";
import { Award } from "@styled-icons/boxicons-regular/Award";
import Navigation from "../components/Navigation";
import Box from "../components/Box";
import Button from "../components/Button";
import Input from "../components/Input";
import { NotificationsProvider } from "../components/Notifications";
import Text from "../components/Text";

const getThemeColours = (themeName, customTheme = {}) => {
  switch (themeName) {
    case "light":
      return {
        primary: customTheme.primary ?? "#f45d48",
        background: customTheme.background ?? "#ffffff",
        sidebar: customTheme.sidebar ?? "#f8f8f8",
        border: customTheme.border ?? "#deebf1",
        text: customTheme.text ?? "#202224",
        grey: customTheme.grey ?? "#747474",
        error: "#f33",
        success: "#44d944",
        info: "#427ee1",
      };
    case "dark":
      return {
        primary: customTheme.primary ?? "#f45d48",
        background: customTheme.background ?? "#1f2023",
        sidebar: customTheme.sidebar ?? "#27282b",
        border: customTheme.border ?? "#303236",
        text: customTheme.text ?? "#f8f8f8",
        grey: customTheme.grey ?? "#aaa",
        error: "#f33",
        success: "#44d944",
        info: "#427ee1",
      };
  }
};

const baseTheme = {
  breakpoints: ["768px", "1400px"],
  space: [0, 2, 4, 8, 16, 32, 64, 128, 256],
  sizes: {
    body: "1200px",
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
    mono: '"Source Code Pro", Courier, monospace',
  },
  fontSizes: [12, 14, 16, 20, 24, 36, 48, 60, 80, 96],
  fontWeights: {
    heading: 700,
    body: 400,
  },
  lineHeights: {
    heading: 1.2,
    body: 1.4,
  },
  radii: [2, 4, 8],
  shadows: {
    edge: "0 8px 24px 0 rgba(0, 0, 0, 0.12)",
    drop: "0 4px 24px 0 rgba(0, 0, 0, 0.24)",
  },
};

const GlobalStyle = createGlobalStyle(
  ({
    theme: { breakpoints, fonts, fontSizes, colors, lineHeights, sizes, space },
  }) => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scrollbar-color: ${colors.border} ${colors.background};
    scrollbar-width: thin;
  }
  body {
    background: ${colors.background};
  }
  #__next {
    color: ${colors.text};
    font-family: ${fonts.body};
    line-height: ${lineHeights.body};
    font-size: ${fontSizes[2]}px;
  }
  #__next main {
    min-height: calc(100vh - 109px);
    max-width: ${sizes.body};
    padding: ${space[4]}px ${space[4]}px 60px;
  }
  @media screen and (min-width: ${breakpoints[0]}) {
    #__next main {
      margin-left: max(calc((100vw - ${sizes.body}) / 2), 200px);
      padding: ${space[5]}px;
    }
  }
  a, a:visited {
    color: ${colors.primary};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  ul, ol {
    padding-left: 1em;
  }
  *::-webkit-scrollbar {
    width: 10px;
  }
  *::-webkit-scrollbar-track {
    background: ${colors.background};
  }
  *::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border: 2px solid ${colors.background};
    border-radius: 10px;
  }
`
);

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;

const Loading = styled(LoaderAlt)`
  animation: ${spin} 1s linear infinite;
`;


function MyApp({ Component, pageProps, initialTheme}) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [theme, setTheme] = useState(initialTheme || "light");
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState();

  const appTheme = {
    ...baseTheme,
    colors: getThemeColours(theme, {primary: "#f45d48"}),
    name: theme,
  };
  
  return (
    <SessionProvider session={pageProps.session}>
          <>
      <Head>
        <title>sqtracker</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro:wght@400;500;700&display=swap"
        />
      </Head>
      <ThemeProvider theme={appTheme}>
        <GlobalStyle />
            <NotificationsProvider>
              <Navigation
                isMobile={isMobile}
                menuIsOpen={menuIsOpen}
                setMenuIsOpen={setMenuIsOpen}
              />
              <Box
                width="100%"
                height="60px"
                bg="background"
                borderBottom="1px solid"
                borderColor="border"
                position="fixed"
                top={0}
                zIndex={9}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  maxWidth="body"
                  height="60px"
                  ml={[
                    0,
                    `max(calc((100vw - ${appTheme.sizes.body}) / 2), 200px)`,
                  ]}
                  px={[4, 5]}
                >
                  <Box display="flex" alignItems="center">
                    <Button
                      onClick={() => setMenuIsOpen(true)}
                      variant="secondary"
                      display={["block", "none"]}
                      px={1}
                      py={1}
                      mr={3}
                    >
                      <Menu size={24} />
                    </Button>
                    {loading && (
                      <Box mr={3}>
                        <Loading size={24} />
                      </Box>
                    )}
                    {true && (
                      <Text
                        icon={Bell}
                        iconColor="primary"
                        iconWrapperProps={{ justifyContent: "flex-end" }}
                        fontSize={[0, 2]}
                      >
                        Site-wide freeleech enabled!
                      </Text>
                    )}
                  </Box>
                  {true && (
                    <Box display="flex" alignItems="center">
                      {userStats && (
                        <Box
                          display={["none", "flex"]}
                          alignItems="center"
                          color="grey"
                        >
                          {Number(SQ_MINIMUM_RATIO) !== -1 && (
                            <>
                              <Sort size={14} />
                              <Text
                                color={
                                  userStats.ratio !== -1 &&
                                  userStats.ratio < SQ_MINIMUM_RATIO
                                    ? "error"
                                    : "grey"
                                }
                                fontSize={0}
                                ml={1}
                                mr={2}
                              >
                                {userStats.ratio === -1
                                  ? "N/A"
                                  : userStats.ratio}
                              </Text>
                            </>
                          )}
                          <CaretUp size={16} />
                          <Text fontSize={0} ml={0} mr={2}>
                            0
                          </Text>
                          <CaretDown size={16} />
                          <Text fontSize={0} ml={0} mr={2}>
                            0
                          </Text>
                          {Number(SQ_MAXIMUM_HIT_N_RUNS) !== -1 && (
                            <>
                              <Run size={16} />
                              <Text
                                color={
                                  userStats.hitnruns > SQ_MAXIMUM_HIT_N_RUNS
                                    ? "error"
                                    : "grey"
                                }
                                fontSize={0}
                                ml={1}
                                mr={2}
                              >
                                {userStats.hitnruns ?? 0}
                              </Text>
                            </>
                          )}
                          <Award size={16} />
                          <Text fontSize={0} ml={0} mr={4}>
                            {userStats.bp ?? 0} BP
                          </Text>
                        </Box>
                      )}
                      <Box as="form">
                        <Input
                          name="query"
                          placeholder="Search"
                          maxWidth="300px"
                        />
                      </Box>
                      {true  && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setThemeAndSave(
                              theme === "light" ? "dark" : "light"
                            );
                          }}
                          width="40px"
                          px={2}
                          py={2}
                          ml={3}
                        >
                          {theme === "light" ? (
                            <Sun size={24} />
                          ) : (
                            <Moon size={24} />
                          )}
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box as="main" mt="60px">
                <Component {...pageProps} />
              </Box>
            </NotificationsProvider>
      </ThemeProvider>
    </>

    </SessionProvider>
  );
}

export default MyApp;