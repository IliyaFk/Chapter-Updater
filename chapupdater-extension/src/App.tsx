import { Button, createTheme, Grid, ThemeProvider, Typography, Box, TextField } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useMemo, useState, useEffect } from 'react';
import "./App.css";

// Define the shape of the message array elements
interface Chapter {
  chapterInfo: string;
  chapterLink: string;
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // State to hold user input and fetched data
  const [mangaName, setMangaName] = useState<string>('');
  const [message, setMessage] = useState<Chapter[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    // Fetch data from the backend using the user input (mangaName)
    fetch(`http://localhost:8000/message`, {
      method: 'POST', // Assuming your backend is set to accept POST requests
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mangaName }), // Send mangaName to the backend
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message || [])) // Ensure data is an array
      .catch((err) => console.error("Error fetching message:", err));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
        typography: {
          h1: {
            fontSize: 16,
            fontWeight: 400,
          },
          body1: {
            fontFamily: 'monospace',
            fontSize: 18,
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box component='main' padding={2} display='flex'>
        <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
          <Grid item>
            <Typography variant='h1'>Manga Chapters Fetcher</Typography>
          </Grid>

          {/* Form to get user input */}
          <Grid item>
            <form onSubmit={handleSubmit}>
              <TextField
                multiline inputProps={{ style: { color: "black" } }}
                label="Enter Manga Name"
                variant="outlined"
                value={mangaName}
                onChange={(e) => setMangaName(e.target.value)} // Update state as user types
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Fetch Chapters
              </Button>
            </form>
          </Grid>

          {/* Display fetched data */}
          <Grid item>
            {message.length > 0 ? (
              message.map((chapter, index) => (
                <Typography key={index} variant='body1'>
                  {chapter.chapterInfo} - <a href={`https://mangafire.to${chapter.chapterLink}`} target="_blank" rel="noopener noreferrer">Read</a>
                </Typography>
              ))
            ) : (
              <Typography variant='body1'>No data available</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
