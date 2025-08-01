import React, { useState, createContext, useContext } from "react";
import {
  Avatar, Button, CssBaseline, TextField, FormControlLabel,
  Checkbox, Link, Grid, Box, Typography, Container, Select,
  MenuItem
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const AuthContext = createContext();

const sampleUsers = {
  aiUser: { username: "aiUser", password: "aiUser", roles: ["aiUser"] },
  aiAdmin: { username: "aiAdmin", password: "aiAdmin", roles: ["aiAdmin"] },
  aiExpert: { username: "aiExpert", password: "aiExpert", roles: ["aiUser", "aiExpert"] }
};

// Authentication Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const login = (username, password) => {
    const foundUser = sampleUsers[username];
    console.log(foundUser);
    if (foundUser && foundUser.password === password) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const changePassword = (username, newPassword) => {
    if (sampleUsers[username]) {
      sampleUsers[username].password = newPassword;
      localStorage.setItem("user", JSON.stringify(sampleUsers[username]));
      setUser({ ...user, password: newPassword });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default function SignIn() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!login(username, password)) {
      setError("Invalid credentials!");
    } else {
      const user = sampleUsers[username];
      console.log(user);
      if (user?.roles?.includes("aiExpert")) {
        window.location.href = "/models";
      } else {
        window.location.href = "/KafkaMigration";
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField fullWidth required label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <br /><br /><TextField fullWidth required type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2">Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
