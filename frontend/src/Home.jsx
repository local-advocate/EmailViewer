import {Navigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import {Avatar} from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Grid from '@mui/material/Grid';
import * as React from 'react';

const drawerWidth = '180px';

const fetchEmails = (setEmails, setError) => {
  const item = sessionStorage.getItem('user');
  if (!item) {
    setError('Logged out');
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user.accessToken;
  fetch('http://localhost:3010/v0/mail', {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      if (!response.ok) throw response;
      return response.json();
    })
    .then((json) => {
      setEmails(json);
    })
    .catch((error) => {
      setEmails([]);
      setError(`${error.status} - ${error.statusText}`);
    });
};


/**
 * @return {object} JSX Table
 */
function Home() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState('');

  const mailBox = 'Inbox';

  // logout pressed
  const logout = () => {
    sessionStorage.removeItem('user');
    setEmails([]);
    setError('Logged Out');
  };

  useEffect(() => {
    fetchEmails(setEmails, setError);
  }, []);

  return (
    <div>
      {
        error !== '' ? <Navigate to="/login" /> :
          <div>
            <Box sx={{display: 'flex'}}>
              <CssBaseline />
              <AppBar
                position="fixed"
                sx={{
                  width: {sm: '100%'},
                  ml: {sm: `${drawerWidth}px`},
                }}
                style={{zIndex: 1300}}
              >
                <Toolbar>
                  <Typography
                    sx={{mr: 2, display: {xs: 'inline'}}}>
                Slug Mail - {mailBox}
                  </Typography>
                  <IconButton id="logout" onClick={logout}
                    style={{'position': 'absolute', 'right': 0}}>
                    <Avatar src={user ? user.avatar : ''}/>
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Toolbar />
                  <i><b>{mailBox}</b></i>
                  <List dense>
                    {emails.map((email) => (
                      <div>
                        <ListItem
                          secondaryAction={
                            <i>{email.received}</i>
                          }
                        >
                        </ListItem>
                        <ListItem
                          secondaryAction={
                            email.starred === 'True' ?
                              <GradeIcon color="success"/> :
                              <GradeIcon color="disabled"/>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar src={email.avatar} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={email.read === 'False' ?
                              <b>{email.from.name}</b>:email.from.name}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{display: 'block'}}
                                  variant="body2"
                                  color="text.primary"
                                  noWrap
                                >
                                  {email.read === 'False' ?
                                    <b>{email.subject}</b> : email.subject}

                                  {<br />}
                                  {email.read === 'False' ?
                                    <b>{email.body}</b> : email.body}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      </div>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          </div>
      }
    </div>
  );
}

export default Home;
