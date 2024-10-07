import { Button, createTheme, Grid, ThemeProvider, Typography, Box, TextField } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useMemo, useState, useEffect } from 'react';
import './App.css';
import image from "./backgroundImage.jpg";

// Define the shape of the manga and chapter data
interface Manga {
  image: string;
  link: string;
  title: string;
}

interface Chapter {
  chapterInfo: string;
  chapterLink: string;
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  console.log(prefersDarkMode);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Input for manga search
  const [mangaResults, setMangaResults] = useState<Manga[]>([]); // List of manga search results
  const [selectedManga, setSelectedManga] = useState<string | null>(null); // Selected manga URL
  const [chapterInfo, setChapterInfo] = useState<Chapter[]>([]); // Fetched chapter info
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(true); // State to control visibility of results

  // Handle manga search
  const handleSearch = () => {
    if (searchQuery) {
      fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mangaName: searchQuery }),
      })
        .then((res) => res.json())
        .then((data) => {
          setShowResults(true);
          setMangaResults(data.results || []); // Assuming the backend returns an array of search results
          setError(null);
        })
        .catch((err) => {
          console.error("Error searching for manga:", err);
          setError("Failed to search for manga.");
        });
    }
  };

  // Handle manga selection and chapter scraping
  const handleMangaSelection = (link:string) => {
    const fullUrl = `https://mangafire.to${link}`;
    setSelectedManga(fullUrl);
    //console.log(url);
    fetch("http://localhost:8000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mangaUrl: fullUrl }), // Send the selected manga URL to scrape chapters
    })
      .then((res) => res.json())
      .then((data) =>  { setShowResults(false); setChapterInfo(data.message || [])  } )
      .catch((err) => {
        console.error("Error fetching chapters:", err);
        setError("Failed to fetch chapters.");
      });
  };

  // Theme setup for dark and light modes
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
            <Typography variant='h1'>Manga Search</Typography>
          </Grid>

          <Grid item>
            <TextField
              label="Search Manga"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Search
            </Button>
          </Grid>

          {/* Show manga search results */}

          {showResults &&
          <Grid item>
            {mangaResults.length > 0 ? (
              <div>
                <Typography variant='h2'>Search Results:</Typography>
                {mangaResults.map((manga, index) => (
                  <div >
                    <div className="container" key={index} >
                        {manga.image ? (
                          <img src={manga.image} alt={manga.title} style={{ width: '200px' }} />
                        ) : (
                          <Typography variant="body1">Image not available</Typography>
                         )}
                    <Typography variant='body1' className = "container">
                      <Button className="button" onClick={() =>  {handleMangaSelection(manga.link)}} variant='contained' color='secondary' style={{ marginLeft: '10px' }}>
                        {manga.title}
                      </Button>
                    </Typography>
                  </div>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant='body1'>No manga found</Typography>
            )}
          </Grid>
        }


          {/* Show selected manga's chapter information */}
          {!showResults &&
          <Grid item>
            {!showResults && selectedManga && chapterInfo.length > 0 ? (
              <div>
                <Typography variant='h2'>Chapters:</Typography>
                {chapterInfo.map((chapter, index) => (
                  <Typography key={index} variant='body1'>
                    {chapter.chapterInfo} - <a href={`https://mangafire.to${chapter.chapterLink}`} target="_blank" rel="noopener noreferrer">Read</a>
                  </Typography>
                ))}
              </div>
            ) : selectedManga ? (
              <Typography variant='body1'>No chapters found for the selected manga</Typography>
            ) : null}
          </Grid>
          }

          {/* Show error if any */}
          {error && (
            <Grid item>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
